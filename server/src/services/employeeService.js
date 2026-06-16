import mongoose from 'mongoose';
import crypto from 'crypto';
import User from '../models/User.js';
import EmployeeProfile from '../models/EmployeeProfile.js';
import Department from '../models/Department.js';
import Designation from '../models/Designation.js';
import Tenant from '../models/Tenant.js';
import logger from '../utils/logger.js';
import { sendEmployeeOnboardingEmail } from '../utils/email.js';
import createError from 'http-errors';

class EmployeeService {
  /**
   * Onboard a new employee. Creates User and EmployeeProfile in a transaction.
   */
  async onboardEmployee(data, tenantId, adminUserId, adminRole) {
    // Note: Transactions disabled for local development (requires replica set)
    // In production, wrap this in a session/transaction for atomicity
    
    try {
      // 1. Check if email already exists in this tenant
      const existingUser = await User.findOne({ email: data.email, tenantId });
      if (existingUser) {
        throw createError(409, 'Email is already registered in this workspace');
      }

      // 2. Validate role assignment permissions using provided admin role
      if (!adminRole) {
        throw createError(403, 'Admin role not provided');
      }

      const requestedRole = data.role || 'employee';
      
      // Permission checks based on admin's role
      if (requestedRole === 'super_admin' && adminRole !== 'super_admin') {
        throw createError(403, 'Only Super Admins can create other Super Admins');
      }
      
      if (requestedRole === 'admin' && adminRole !== 'super_admin') {
        throw createError(403, 'Only Super Admins can create Admins');
      }
      
      if (requestedRole === 'hr_admin' && !['super_admin', 'admin'].includes(adminRole)) {
        throw createError(403, 'Only Super Admins or Admins can create HR Admins');
      }
      
      if (requestedRole === 'manager' && 
          !['super_admin', 'admin', 'hr_admin'].includes(adminRole)) {
        throw createError(403, 'You do not have permission to assign this role');
      }

      logger.info('Creating user with role', { 
        email: data.email,
        role: requestedRole,
        createdByRole: adminRole 
      });

      // 3. Generate random temporary password
      const tempPassword = crypto.randomBytes(16).toString('hex');

      // 4. Create User account
      const user = await User.create({
        tenantId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: tempPassword,
        role: requestedRole,
        isEmailVerified: true, // Internal invites are auto-verified
      });

      // 5. Create EmployeeProfile
      await EmployeeProfile.create({
        tenantId,
        userId: user._id,
        departmentId: data.departmentId || null,
        teamId: data.teamId || null,
        designationId: data.designationId || null,
        employmentType: data.employmentType,
        joiningDate: data.joiningDate,
      });

      // 6. Generate Password Reset Token for onboarding flow
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
      
      user.passwordResetToken = resetTokenHash;
      user.passwordResetExpires = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
      await user.save();

      // 7. Get company name for email
      const tenant = await Tenant.findById(tenantId);

      // 8. Send welcome email with password setup link
      try {
        await sendEmployeeOnboardingEmail({
          email: user.email,
          firstName: user.firstName,
          resetToken,
          companyName: tenant?.companyName || 'Your Company',
        });
        logger.info('Onboarding email sent successfully', { 
          email: user.email,
          role: user.role 
        });
      } catch (emailError) {
        logger.error('Failed to send onboarding email', { 
          email: user.email,
          error: emailError.message 
        });
        // Don't throw - employee is already created, just log the error
      }

      return user;
    } catch (error) {
      // If user was created but profile failed, clean up
      // Note: This is best-effort cleanup without transactions
      if (error.name === 'MongoError' && error.code === 11000) {
        throw createError(409, 'Email is already registered in this workspace');
      }
      throw error;
    }
  }

  /**
   * List all employees with pagination, search, and filtering
   */
  async listEmployees({ tenantId, page = 1, limit = 20, search, departmentId, status }) {
    const skip = (page - 1) * limit;

    const pipeline = [
      { $match: { tenantId: new mongoose.Types.ObjectId(tenantId) } }
    ];

    if (status) {
      pipeline.push({ $match: { status } });
    }

    if (departmentId) {
      pipeline.push({ $match: { departmentId: new mongoose.Types.ObjectId(departmentId) } });
    }

    // Lookup User details
    pipeline.push({
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user',
      }
    });
    pipeline.push({ $unwind: '$user' });

    // Search by name or email
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      pipeline.push({
        $match: {
          $or: [
            { 'user.firstName': searchRegex },
            { 'user.lastName': searchRegex },
            { 'user.email': searchRegex },
          ]
        }
      });
    }

    // Lookups for Org structures
    pipeline.push({
      $lookup: {
        from: 'departments',
        localField: 'departmentId',
        foreignField: '_id',
        as: 'department',
      }
    });
    pipeline.push({
      $lookup: {
        from: 'designations',
        localField: 'designationId',
        foreignField: '_id',
        as: 'designation',
      }
    });

    pipeline.push({
      $project: {
        _id: 1,
        status: 1,
        employmentType: 1,
        joiningDate: 1,
        user: {
          _id: '$user._id',
          firstName: '$user.firstName',
          lastName: '$user.lastName',
          email: '$user.email',
          role: '$user.role',
          avatar: '$user.avatar',
        },
        department: { $arrayElemAt: ['$department', 0] },
        designation: { $arrayElemAt: ['$designation', 0] },
      }
    });

    const [results, totalCount] = await Promise.all([
      EmployeeProfile.aggregate([...pipeline, { $skip: skip }, { $limit: limit }]),
      EmployeeProfile.aggregate([...pipeline, { $count: 'total' }])
    ]);

    const total = totalCount.length > 0 ? totalCount[0].total : 0;

    return {
      employees: results,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      }
    };
  }

  async getEmployeeById(tenantId, employeeId) {
    const profile = await EmployeeProfile.findOne({ _id: employeeId, tenantId })
      .populate('userId', 'firstName lastName email role avatar')
      .populate('departmentId', 'name')
      .populate('teamId', 'name')
      .populate('designationId', 'title');

    if (!profile) {
      throw createError(404, 'Employee not found');
    }

    return profile;
  }
}

export default new EmployeeService();
