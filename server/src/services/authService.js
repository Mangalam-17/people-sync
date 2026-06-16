import { v4 as uuidv4 } from 'uuid';
import userRepository from '../repositories/userRepository.js';
import tenantRepository from '../repositories/tenantRepository.js';
import refreshTokenRepository from '../repositories/refreshTokenRepository.js';
import auditService from './auditService.js';
import emailService from './emailService.js';
import invitationService from './invitationService.js';
import { ROLES, ROLE_PERMISSIONS, AUTH, AUDIT_ACTIONS } from '../config/constants.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  hashToken,
  generateRandomToken,
  parseExpiryToMs,
} from '../utils/tokenUtils.js';
import AppError from '../utils/AppError.js';
import env from '../config/env.js';

class AuthService {
  /**
   * Register a new tenant and its super admin user.
   * Requires valid invitation code.
   */
  async register({ invitationCode, companyName, firstName, lastName, email, password }, { ipAddress, userAgent }) {
    // Validate invitation code (REQUIRED)
    if (!invitationCode) {
      throw AppError.badRequest(
        'Invitation code is required. Please contact your administrator to get an invitation.',
        'INVITATION_REQUIRED'
      );
    }

    const invitation = await invitationService.validateInvitation(invitationCode);

    // Verify email matches invitation
    if (invitation.email.toLowerCase() !== email.toLowerCase()) {
      throw AppError.badRequest(
        'Email does not match the invitation. Please use the email address that received the invitation.',
        'EMAIL_MISMATCH'
      );
    }

    // Check if email is already used across any tenant
    const existingUser = await userRepository.findByEmailAcrossTenants(email);
    if (existingUser) {
      throw AppError.conflict('An account with this email already exists', 'AUTH_EMAIL_EXISTS');
    }

    // Use invitation company name if not provided
    const finalCompanyName = companyName || invitation.companyName;

    // Create tenant
    const slug = await tenantRepository.generateUniqueSlug(finalCompanyName);
    const tenant = await tenantRepository.create({
      name: finalCompanyName,
      slug,
      plan: invitation.plan || 'free',
      maxUsers: invitation.maxUsers,
    });

    // Generate email verification token
    const { token: verificationToken, hashedToken } = generateRandomToken();

    // Create super admin user
    const user = await userRepository.create({
      tenantId: tenant._id,
      firstName: firstName || invitation.firstName,
      lastName: lastName || invitation.lastName,
      email,
      password,
      role: ROLES.SUPER_ADMIN,
      permissions: ROLE_PERMISSIONS[ROLES.SUPER_ADMIN],
      isEmailVerified: false,
      emailVerificationToken: hashedToken,
      emailVerificationExpires: new Date(Date.now() + AUTH.VERIFICATION_TOKEN_EXPIRES_HOURS * 60 * 60 * 1000),
    });

    // Update tenant with owner
    await tenantRepository.update(tenant._id, { ownerId: user._id });

    // Mark invitation as used
    await invitationService.useInvitation(invitationCode, user._id, tenant._id);

    // Send verification email
    const verificationUrl = `${env.CLIENT_URL}/verify-email/${verificationToken}`;
    await emailService.sendVerificationEmail(email, firstName || invitation.firstName, verificationUrl);

    // Audit log
    await auditService.log({
      tenantId: tenant._id,
      userId: user._id,
      action: AUDIT_ACTIONS.AUTH_REGISTER,
      resource: 'User',
      resourceId: user._id,
      details: { companyName: finalCompanyName, email, invitationCode },
      ipAddress,
      userAgent,
    });

    await auditService.log({
      tenantId: tenant._id,
      userId: user._id,
      action: AUDIT_ACTIONS.TENANT_CREATED,
      resource: 'Tenant',
      resourceId: tenant._id,
      details: { name: finalCompanyName, slug, viaInvitation: invitationCode },
      ipAddress,
      userAgent,
    });

    return {
      user: user.toJSON(),
      tenant: tenant.toJSON(),
    };
  }

  /**
   * Login with email and password.
   * Returns access token + sets refresh token cookie.
   */
  async login({ email, password }, { ipAddress, userAgent }) {
    // Find user across tenants (for login, we need to find the user first)
    const user = await userRepository.findByEmailAcrossTenants(email);

    if (!user) {
      throw AppError.unauthorized('Invalid email or password', 'AUTH_INVALID_CREDENTIALS');
    }

    // Get full user with secrets
    const userWithSecrets = await userRepository.findById(user._id, true);

    // Check account lock
    if (userWithSecrets.isLocked()) {
      throw AppError.tooMany(
        'Account is temporarily locked due to too many failed login attempts. Please try again later.',
        'AUTH_ACCOUNT_LOCKED'
      );
    }

    // Check if account is active
    if (!userWithSecrets.isActive) {
      throw AppError.forbidden('Your account has been deactivated. Please contact your administrator.', 'AUTH_INACTIVE');
    }

    // Check email verification
    if (!userWithSecrets.isEmailVerified) {
      throw AppError.forbidden(
        'Please verify your email address before logging in. Check your inbox for the verification link.',
        'AUTH_EMAIL_NOT_VERIFIED'
      );
    }

    // Verify password
    const isPasswordValid = await userWithSecrets.comparePassword(password);
    if (!isPasswordValid) {
      await userWithSecrets.incrementLoginAttempts();

      await auditService.log({
        tenantId: user.tenantId,
        userId: user._id,
        action: AUDIT_ACTIONS.AUTH_FAILED_LOGIN,
        resource: 'User',
        resourceId: user._id,
        details: { reason: 'Invalid password' },
        ipAddress,
        userAgent,
      });

      throw AppError.unauthorized('Invalid email or password', 'AUTH_INVALID_CREDENTIALS');
    }

    // Reset login attempts on successful login
    await userWithSecrets.resetLoginAttempts();

    // Update last login
    await userRepository.update(user._id, { lastLoginAt: new Date() });

    // Generate tokens
    const tokenPayload = {
      userId: user._id.toString(),
      tenantId: user.tenantId.toString(),
      role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Store refresh token (hashed) with a new family
    const family = uuidv4();
    const refreshExpiresMs = parseExpiryToMs(env.JWT_REFRESH_EXPIRES_IN);
    await refreshTokenRepository.create({
      userId: user._id,
      tenantId: user.tenantId,
      tokenHash: hashToken(refreshToken),
      family,
      expiresAt: new Date(Date.now() + refreshExpiresMs),
      userAgent,
      ipAddress,
    });

    // Audit log
    await auditService.log({
      tenantId: user.tenantId,
      userId: user._id,
      action: AUDIT_ACTIONS.AUTH_LOGIN,
      resource: 'User',
      resourceId: user._id,
      ipAddress,
      userAgent,
    });

    return {
      accessToken,
      refreshToken,
      user: user.toJSON(),
    };
  }

  /**
   * Refresh token rotation.
   * Validates the old refresh token, issues new pair, revokes old one.
   */
  async refreshTokens(oldRefreshToken, { ipAddress, userAgent }) {
    // Verify JWT signature
    let decoded;
    try {
      decoded = verifyRefreshToken(oldRefreshToken);
    } catch {
      throw AppError.unauthorized('Invalid or expired refresh token', 'AUTH_REFRESH_INVALID');
    }

    const tokenHash = hashToken(oldRefreshToken);
    const storedToken = await refreshTokenRepository.findByTokenHash(tokenHash);

    if (!storedToken) {
      // Possible reuse attack — revoke entire family
      // Try to find any token in this family by the user
      await refreshTokenRepository.revokeAllByUser(decoded.userId);

      await auditService.log({
        tenantId: decoded.tenantId,
        userId: decoded.userId,
        action: 'auth.token_reuse_detected',
        resource: 'RefreshToken',
        details: { reason: 'Refresh token reuse detected — all sessions revoked' },
        ipAddress,
        userAgent,
      });

      throw AppError.unauthorized(
        'Refresh token has been revoked. Please log in again.',
        'AUTH_REFRESH_REVOKED'
      );
    }

    // Revoke old token
    await refreshTokenRepository.revokeByTokenHash(tokenHash);

    // Get current user
    const user = await userRepository.findById(decoded.userId);
    if (!user || !user.isActive) {
      throw AppError.unauthorized('User not found or inactive', 'AUTH_USER_INACTIVE');
    }

    // Generate new token pair
    const tokenPayload = {
      userId: user._id.toString(),
      tenantId: user.tenantId.toString(),
      role: user.role,
    };

    const newAccessToken = generateAccessToken(tokenPayload);
    const newRefreshToken = generateRefreshToken(tokenPayload);

    // Store new refresh token in the same family
    const refreshExpiresMs = parseExpiryToMs(env.JWT_REFRESH_EXPIRES_IN);
    await refreshTokenRepository.create({
      userId: user._id,
      tenantId: user.tenantId,
      tokenHash: hashToken(newRefreshToken),
      family: storedToken.family,
      expiresAt: new Date(Date.now() + refreshExpiresMs),
      userAgent,
      ipAddress,
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: user.toJSON(),
    };
  }

  /**
   * Logout — revoke the refresh token.
   */
  async logout(refreshToken, userId, { ipAddress, userAgent }) {
    if (refreshToken) {
      const tokenHash = hashToken(refreshToken);
      await refreshTokenRepository.revokeByTokenHash(tokenHash);
    }

    const user = await userRepository.findById(userId);
    if (user) {
      await auditService.log({
        tenantId: user.tenantId,
        userId: user._id,
        action: AUDIT_ACTIONS.AUTH_LOGOUT,
        resource: 'User',
        resourceId: user._id,
        ipAddress,
        userAgent,
      });
    }
  }

  /**
   * Verify email with token.
   */
  async verifyEmail(token, { ipAddress, userAgent }) {
    const hashedToken = hashToken(token);
    const user = await userRepository.findByVerificationToken(hashedToken);

    if (!user) {
      throw AppError.badRequest('Invalid or expired verification token', 'AUTH_VERIFY_INVALID');
    }

    await userRepository.update(user._id, {
      isEmailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null,
    });

    // Send welcome email
    const loginUrl = `${env.CLIENT_URL}/login`;
    await emailService.sendWelcomeEmail(user.email, user.firstName, loginUrl);

    await auditService.log({
      tenantId: user.tenantId,
      userId: user._id,
      action: AUDIT_ACTIONS.AUTH_VERIFY_EMAIL,
      resource: 'User',
      resourceId: user._id,
      ipAddress,
      userAgent,
    });

    return { message: 'Email verified successfully' };
  }

  /**
   * Forgot password — send reset link.
   */
  async forgotPassword(email, { ipAddress, userAgent }) {
    const user = await userRepository.findByEmailAcrossTenants(email);

    // Always return success to prevent email enumeration
    if (!user) {
      return { message: 'If an account exists with that email, a password reset link has been sent.' };
    }

    const { token, hashedToken } = generateRandomToken();

    await userRepository.update(user._id, {
      passwordResetToken: hashedToken,
      passwordResetExpires: new Date(Date.now() + AUTH.RESET_TOKEN_EXPIRES_HOURS * 60 * 60 * 1000),
    });

    const resetUrl = `${env.CLIENT_URL}/reset-password/${token}`;
    await emailService.sendPasswordResetEmail(user.email, user.firstName, resetUrl);

    await auditService.log({
      tenantId: user.tenantId,
      userId: user._id,
      action: AUDIT_ACTIONS.AUTH_FORGOT_PASSWORD,
      resource: 'User',
      resourceId: user._id,
      ipAddress,
      userAgent,
    });

    return { message: 'If an account exists with that email, a password reset link has been sent.' };
  }

  /**
   * Reset password with token.
   */
  async resetPassword(token, newPassword, { ipAddress, userAgent }) {
    const hashedToken = hashToken(token);
    const user = await userRepository.findByResetToken(hashedToken);

    if (!user) {
      throw AppError.badRequest('Invalid or expired reset token', 'AUTH_RESET_INVALID');
    }

    user.password = newPassword;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    // Revoke all refresh tokens (force re-login on all devices)
    await refreshTokenRepository.revokeAllByUser(user._id);

    await auditService.log({
      tenantId: user.tenantId,
      userId: user._id,
      action: AUDIT_ACTIONS.AUTH_RESET_PASSWORD,
      resource: 'User',
      resourceId: user._id,
      ipAddress,
      userAgent,
    });

    return { message: 'Password reset successful. Please log in with your new password.' };
  }

  /**
   * Get current user profile.
   */
  async getCurrentUser(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw AppError.notFound('User not found');
    }
    return user.toJSON();
  }
}

export default new AuthService();
