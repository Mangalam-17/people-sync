import userRepository from '../repositories/userRepository.js';
import auditService from './auditService.js';
import emailService from './emailService.js';
import { ROLES, ROLE_PERMISSIONS, ROLE_HIERARCHY, AUDIT_ACTIONS } from '../config/constants.js';
import { generateRandomToken } from '../utils/tokenUtils.js';
import AppError from '../utils/AppError.js';
import env from '../config/env.js';

class UserService {
  /**
   * List users within a tenant (paginated, filterable).
   */
  async listUsers(tenantId, filters) {
    return userRepository.findByTenant(tenantId, filters);
  }

  /**
   * Get a single user by ID (tenant-scoped).
   */
  async getUserById(tenantId, userId, requestingUser) {
    const user = await userRepository.findById(userId);

    if (!user || user.tenantId.toString() !== tenantId.toString()) {
      throw AppError.notFound('User not found');
    }

    // Employees can only view themselves
    if (requestingUser.role === ROLES.EMPLOYEE && requestingUser.userId !== userId.toString()) {
      throw AppError.forbidden('You can only view your own profile');
    }

    return user.toJSON();
  }

  /**
   * Create (invite) a new user within a tenant.
   * Only HR Admin+ can create users.
   */
  async createUser(tenantId, data, requestingUser, { ipAddress, userAgent }) {
    // Check if email already exists in tenant
    const emailExists = await userRepository.emailExistsInTenant(tenantId, data.email);
    if (emailExists) {
      throw AppError.conflict('A user with this email already exists in your organization', 'USER_EMAIL_EXISTS');
    }

    // Prevent creating users with higher role than your own
    const requesterRoleIndex = ROLE_HIERARCHY.indexOf(requestingUser.role);
    const newUserRoleIndex = ROLE_HIERARCHY.indexOf(data.role || ROLES.EMPLOYEE);
    if (newUserRoleIndex < requesterRoleIndex) {
      throw AppError.forbidden('You cannot create a user with a higher role than your own');
    }

    // Generate verification token
    const { token: verificationToken, hashedToken } = generateRandomToken();

    const user = await userRepository.create({
      tenantId,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      role: data.role || ROLES.EMPLOYEE,
      permissions: ROLE_PERMISSIONS[data.role || ROLES.EMPLOYEE],
      isEmailVerified: false,
      emailVerificationToken: hashedToken,
      emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    // Send verification email
    const verificationUrl = `${env.CLIENT_URL}/verify-email/${verificationToken}`;
    await emailService.sendVerificationEmail(data.email, data.firstName, verificationUrl);

    // Audit log
    await auditService.log({
      tenantId,
      userId: requestingUser.userId,
      action: AUDIT_ACTIONS.USER_CREATED,
      resource: 'User',
      resourceId: user._id,
      details: { email: data.email, role: data.role },
      ipAddress,
      userAgent,
    });

    return user.toJSON();
  }

  /**
   * Update a user profile.
   */
  async updateUser(tenantId, userId, data, requestingUser, { ipAddress, userAgent }) {
    const user = await userRepository.findById(userId);
    if (!user || user.tenantId.toString() !== tenantId.toString()) {
      throw AppError.notFound('User not found');
    }

    // Employees can only update themselves (limited fields)
    if (requestingUser.role === ROLES.EMPLOYEE) {
      if (requestingUser.userId !== userId.toString()) {
        throw AppError.forbidden('You can only update your own profile');
      }
      // Restrict fields employees can update
      const allowedFields = ['firstName', 'lastName', 'avatar'];
      const filteredData = {};
      for (const field of allowedFields) {
        if (data[field] !== undefined) filteredData[field] = data[field];
      }
      data = filteredData;
    }

    // Never allow role/permissions update through this endpoint
    delete data.role;
    delete data.permissions;
    delete data.password;
    delete data.email;

    const updatedUser = await userRepository.update(userId, data);

    await auditService.log({
      tenantId,
      userId: requestingUser.userId,
      action: AUDIT_ACTIONS.USER_UPDATED,
      resource: 'User',
      resourceId: userId,
      details: { updatedFields: Object.keys(data) },
      ipAddress,
      userAgent,
    });

    return updatedUser.toJSON();
  }

  /**
   * Change a user's role (Super Admin only).
   */
  async changeUserRole(tenantId, userId, newRole, requestingUser, { ipAddress, userAgent }) {
    const user = await userRepository.findById(userId);
    if (!user || user.tenantId.toString() !== tenantId.toString()) {
      throw AppError.notFound('User not found');
    }

    if (requestingUser.userId === userId.toString()) {
      throw AppError.badRequest('You cannot change your own role');
    }

    if (!Object.values(ROLES).includes(newRole)) {
      throw AppError.badRequest('Invalid role');
    }

    const updatedUser = await userRepository.update(userId, {
      role: newRole,
      permissions: ROLE_PERMISSIONS[newRole],
    });

    await auditService.log({
      tenantId,
      userId: requestingUser.userId,
      action: AUDIT_ACTIONS.USER_ROLE_CHANGED,
      resource: 'User',
      resourceId: userId,
      details: { oldRole: user.role, newRole },
      ipAddress,
      userAgent,
    });

    return updatedUser.toJSON();
  }

  /**
   * Deactivate a user (soft delete).
   */
  async deactivateUser(tenantId, userId, requestingUser, { ipAddress, userAgent }) {
    const user = await userRepository.findById(userId);
    if (!user || user.tenantId.toString() !== tenantId.toString()) {
      throw AppError.notFound('User not found');
    }

    if (requestingUser.userId === userId.toString()) {
      throw AppError.badRequest('You cannot deactivate your own account');
    }

    const updatedUser = await userRepository.update(userId, { isActive: false });

    await auditService.log({
      tenantId,
      userId: requestingUser.userId,
      action: AUDIT_ACTIONS.USER_DELETED,
      resource: 'User',
      resourceId: userId,
      details: { email: user.email },
      ipAddress,
      userAgent,
    });

    return updatedUser.toJSON();
  }
}

export default new UserService();
