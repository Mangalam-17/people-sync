import User from '../models/User.js';
import createError from 'http-errors';
import logger from '../utils/logger.js';

class UserService {
  /**
   * Update user role with permission validation
   */
  async updateUserRole(userId, newRole, adminId, tenantId) {
    try {
      // Get the target user and admin
      const targetUser = await User.findOne({ _id: userId, tenantId });
      const admin = await User.findById(adminId);

      if (!targetUser) {
        throw createError(404, 'User not found');
      }

      if (!admin) {
        throw createError(403, 'Admin user not found');
      }

      // Permission validations
      if (newRole === 'super_admin' && admin.role !== 'super_admin') {
        throw createError(403, 'Only Super Admins can assign Super Admin role');
      }

      if (newRole === 'hr_admin' && admin.role !== 'super_admin') {
        throw createError(403, 'Only Super Admins can assign HR Admin role');
      }

      if ((newRole === 'manager' || newRole === 'hr_admin') && 
          !['super_admin', 'hr_admin'].includes(admin.role)) {
        throw createError(403, 'You do not have permission to assign this role');
      }

      // Prevent self-demotion for super_admin
      if (targetUser._id.toString() === adminId.toString() && 
          targetUser.role === 'super_admin' && 
          newRole !== 'super_admin') {
        throw createError(403, 'Super Admins cannot demote themselves');
      }

      logger.info('Updating user role', {
        userId: targetUser._id,
        email: targetUser.email,
        oldRole: targetUser.role,
        newRole,
        updatedBy: admin.email
      });

      // Update the role
      targetUser.role = newRole;
      await targetUser.save();

      logger.info('User role updated successfully', {
        userId: targetUser._id,
        email: targetUser.email,
        newRole
      });

      return targetUser;
    } catch (error) {
      logger.error('Failed to update user role', {
        userId,
        newRole,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Get all users in tenant with pagination
   */
  async listUsers({ tenantId, page = 1, limit = 20, search = '', role = '' }) {
    const skip = (page - 1) * limit;
    
    const query = { tenantId };
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (role) {
      query.role = role;
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .select('firstName lastName email role isActive createdAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(query),
    ]);

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

export default new UserService();
