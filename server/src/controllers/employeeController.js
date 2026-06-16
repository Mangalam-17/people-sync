import employeeService from '../services/employeeService.js';
import { successResponse, createdResponse, paginatedResponse } from '../utils/responseFormatter.js';
import logger from '../utils/logger.js';

class EmployeeController {
  async onboard(req, res, next) {
    try {
      logger.info('Onboarding new employee', { 
        email: req.body.email,
        tenantId: req.user.tenantId 
      });

      const user = await employeeService.onboardEmployee(
        req.body,
        req.user.tenantId,
        req.user.userId, // Fixed: was req.user.id, should be req.user.userId
        req.user.role    // Pass admin role for validation
      );

      logger.info('Employee onboarded successfully', { 
        employeeId: user._id,
        email: user.email 
      });

      return createdResponse(res, { employee: { id: user._id, email: user.email } }, 'Employee onboarded successfully. Invite sent.');
    } catch (error) {
      logger.error('Failed to onboard employee', { 
        email: req.body.email,
        error: error.message,
        tenantId: req.user.tenantId
      });
      next(error);
    }
  }

  async list(req, res, next) {
    try {
      const result = await employeeService.listEmployees({
        tenantId: req.user.tenantId,
        ...req.query,
      });

      return successResponse(res, result, 'Employees retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const employee = await employeeService.getEmployeeById(
        req.user.tenantId,
        req.params.id
      );

      return successResponse(res, { employee }, 'Employee retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new EmployeeController();
