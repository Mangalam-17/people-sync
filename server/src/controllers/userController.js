import userService from '../services/userService.js';
import { successResponse, paginatedResponse } from '../utils/responseFormatter.js';
import logger from '../utils/logger.js';

class UserController {
  async updateRole(req, res, next) {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      logger.info('Role update request received', {
        userId,
        newRole: role,
        requestedBy: req.user.email
      });

      const user = await userService.updateUserRole(
        userId,
        role,
        req.user.id,
        req.user.tenantId
      );

      return successResponse(res, { user }, 'User role updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async list(req, res, next) {
    try {
      const result = await userService.listUsers({
        tenantId: req.user.tenantId,
        ...req.query,
      });

      return paginatedResponse(res, result.data, result.meta, 'Users retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
