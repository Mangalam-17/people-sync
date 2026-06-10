import { asyncHandler } from '../utils/asyncHandler.js';
import employeeService from '../services/employeeService.js';
import { sendResponse } from '../utils/response.js';

class EmployeeController {
  onboard = asyncHandler(async (req, res) => {
    const user = await employeeService.onboardEmployee(
      req.body,
      req.user.tenantId,
      req.user.id
    );

    sendResponse(res, 201, 'Employee onboarded successfully. Invite sent.', {
      employee: { id: user._id, email: user.email },
    });
  });

  list = asyncHandler(async (req, res) => {
    const result = await employeeService.listEmployees({
      tenantId: req.user.tenantId,
      ...req.query,
    });

    sendResponse(res, 200, 'Employees retrieved successfully', result);
  });

  getById = asyncHandler(async (req, res) => {
    const employee = await employeeService.getEmployeeById(
      req.user.tenantId,
      req.params.id
    );

    sendResponse(res, 200, 'Employee retrieved successfully', { employee });
  });
}

export default new EmployeeController();
