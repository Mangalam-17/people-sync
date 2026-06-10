import mongoose from 'mongoose';
import crypto from 'crypto';
import User from '../models/User.js';
import EmployeeProfile from '../models/EmployeeProfile.js';
import Department from '../models/Department.js';
import Designation from '../models/Designation.js';
import { logger } from '../utils/logger.js';
import createError from 'http-errors';

class EmployeeService {
  /**
   * Onboard a new employee. Creates User and EmployeeProfile in a transaction.
   */
  async onboardEmployee(data, tenantId, adminId) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. Check if email already exists in this tenant
      const existingUser = await User.findOne({ email: data.email, tenantId }).session(session);
      if (existingUser) {
        throw createError(409, 'Email is already registered in this workspace');
      }

      // 2. Generate random temporary password
      const tempPassword = crypto.randomBytes(16).toString('hex');

      // 3. Create User account
      const [user] = await User.create(
        [
          {
            tenantId,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: tempPassword,
            role: data.role,
            isEmailVerified: true, // Internal invites are auto-verified
          },
        ],
        { session }
      );

      // 4. Create EmployeeProfile
      await EmployeeProfile.create(
        [
          {
            tenantId,
            userId: user._id,
            departmentId: data.departmentId || null,
            teamId: data.teamId || null,
            designationId: data.designationId || null,
            employmentType: data.employmentType,
            joiningDate: data.joiningDate,
            baseSalary: data.baseSalary,
          },
        ],
        { session }
      );

      // 5. Generate Password Reset Token for onboarding flow
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
      
      user.passwordResetToken = resetTokenHash;
      user.passwordResetExpires = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
      await user.save({ session });

      // TODO: Send Email (Welcome to PeopleSync + set password link)
      logger.info(`Onboarding email sent to ${user.email} with reset token: ${resetToken}`);

      await session.commitTransaction();
      return user;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
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
        'user._id': 1,
        'user.firstName': 1,
        'user.lastName': 1,
        'user.email': 1,
        'user.role': 1,
        'user.avatar': 1,
        'department.name': { $arrayElemAt: ['$department.name', 0] },
        'designation.title': { $arrayElemAt: ['$designation.title', 0] },
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
