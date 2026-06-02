import userService from '../services/userService.js';
import { successResponse, createdResponse, paginatedResponse } from '../utils/responseFormatter.js';

class UserController {
  /**
   * GET /api/v1/users
   */
  async list(req, res, next) {
    try {
      const { users, total, page, limit } = await userService.listUsers(
        req.user.tenantId,
        req.query
      );
      return paginatedResponse(res, users, { page, limit, total });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/users/:id
   */
  async getById(req, res, next) {
    try {
      const user = await userService.getUserById(
        req.user.tenantId,
        req.params.id,
        req.user
      );
      return successResponse(res, { user });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/users
   */
  async create(req, res, next) {
    try {
      const user = await userService.createUser(
        req.user.tenantId,
        req.body,
        req.user,
        { ipAddress: req.ip, userAgent: req.get('User-Agent') }
      );
      return createdResponse(res, { user }, 'User created successfully. A verification email has been sent.');
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/users/:id
   */
  async update(req, res, next) {
    try {
      const user = await userService.updateUser(
        req.user.tenantId,
        req.params.id,
        req.body,
        req.user,
        { ipAddress: req.ip, userAgent: req.get('User-Agent') }
      );
      return successResponse(res, { user }, 'User updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/users/:id/role
   */
  async changeRole(req, res, next) {
    try {
      const user = await userService.changeUserRole(
        req.user.tenantId,
        req.params.id,
        req.body.role,
        req.user,
        { ipAddress: req.ip, userAgent: req.get('User-Agent') }
      );
      return successResponse(res, { user }, 'User role updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/users/:id
   */
  async deactivate(req, res, next) {
    try {
      const user = await userService.deactivateUser(
        req.user.tenantId,
        req.params.id,
        req.user,
        { ipAddress: req.ip, userAgent: req.get('User-Agent') }
      );
      return successResponse(res, { user }, 'User deactivated successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
