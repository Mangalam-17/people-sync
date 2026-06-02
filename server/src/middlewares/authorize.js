import { ROLE_PERMISSIONS, ROLE_HIERARCHY } from '../config/constants.js';
import AppError from '../utils/AppError.js';

/**
 * Authorization middleware — checks permissions.
 * Can check both specific permissions and minimum role level.
 *
 * Usage:
 *   authorize('user:create')                    // Requires specific permission
 *   authorize('user:create', 'user:read')       // Requires ANY of these permissions
 *   authorizeRole('hr_admin')                   // Requires hr_admin or above
 */
export const authorize = (...requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(AppError.unauthorized('Authentication required'));
    }

    const { role } = req.user;
    const userPermissions = ROLE_PERMISSIONS[role] || [];

    const hasPermission = requiredPermissions.some((perm) =>
      userPermissions.includes(perm)
    );

    if (!hasPermission) {
      return next(
        AppError.forbidden(
          'You do not have permission to perform this action',
          'AUTH_INSUFFICIENT_PERMISSIONS'
        )
      );
    }

    next();
  };
};

/**
 * Role-based authorization — requires minimum role level.
 */
export const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(AppError.unauthorized('Authentication required'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        AppError.forbidden(
          'You do not have the required role to perform this action',
          'AUTH_INSUFFICIENT_ROLE'
        )
      );
    }

    next();
  };
};

/**
 * Self-or-admin authorization.
 * Allows the user to access their own resource or if they have admin role.
 */
export const authorizeSelfOrRole = (...adminRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(AppError.unauthorized('Authentication required'));
    }

    const isOwnResource = req.params.id === req.user.userId;
    const isAdmin = adminRoles.includes(req.user.role);

    if (!isOwnResource && !isAdmin) {
      return next(
        AppError.forbidden('You can only access your own resources')
      );
    }

    next();
  };
};
