import leaveService from '../services/leaveService.js';
import { successResponse, createdResponse } from '../utils/responseFormatter.js';
import logger from '../utils/logger.js';

/**
 * @desc    Apply for leave
 * @route   POST /api/v1/leaves
 * @access  Private (Employee)
 */
export const applyLeave = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const tenantId = req.user.tenantId;
    const leaveData = req.body;

    logger.info(`📝 Leave application from user ${userId}`);

    const leave = await leaveService.applyLeave(userId, tenantId, leaveData);

    return createdResponse(res, leave, 'Leave request submitted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get leave requests
 * @route   GET /api/v1/leaves
 * @access  Private
 */
export const getLeaveRequests = async (req, res, next) => {
  try {
    const tenantId = req.user.tenantId;
    const { employeeId, status, leaveType, startDate, endDate, page, limit } = req.query;

    // If not admin/hr/manager, only show own leaves
    let finalEmployeeId = employeeId;
    if (!['super_admin', 'hr_admin', 'manager'].includes(req.user.role)) {
      const EmployeeProfile = (await import('../models/EmployeeProfile.js')).default;
      const employee = await EmployeeProfile.findOne({ userId: req.user.userId, tenantId: tenantId });
      if (employee) {
        finalEmployeeId = employee._id.toString();
      }
    }

    const result = await leaveService.getLeaveRequests(tenantId, {
      employeeId: finalEmployeeId,
      status,
      leaveType,
      startDate,
      endDate,
      page,
      limit,
    });

    return successResponse(res, {
      requests: result.requests,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get pending leaves for approval
 * @route   GET /api/v1/leaves/pending
 * @access  Private (HR/Manager only)
 */
export const getPendingLeaves = async (req, res, next) => {
  try {
    const tenantId = req.user.tenantId;
    const { page, limit } = req.query;

    const result = await leaveService.getPendingLeaves(tenantId, { page, limit });

    return successResponse(res, {
      requests: result.requests,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Approve or reject leave
 * @route   PATCH /api/v1/leaves/:id/review
 * @access  Private (HR/Manager only)
 */
export const reviewLeave = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { decision, reviewNotes } = req.body;
    const reviewerId = req.user.userId;
    const tenantId = req.user.tenantId;

    logger.info(`✅ Leave review for ${id}: ${decision}`);

    const leave = await leaveService.reviewLeave(
      id,
      tenantId,
      reviewerId,
      decision,
      reviewNotes
    );

    return successResponse(res, leave, `Leave ${decision} successfully`);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel leave request
 * @route   PATCH /api/v1/leaves/:id/cancel
 * @access  Private (Employee - own leaves)
 */
export const cancelLeave = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const tenantId = req.user.tenantId;

    logger.info(`❌ Leave cancellation for ${id}`);

    const leave = await leaveService.cancelLeave(id, userId, tenantId);

    return successResponse(res, leave, 'Leave cancelled successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get leave balance
 * @route   GET /api/v1/leaves/balance
 * @access  Private (Employee)
 */
export const getLeaveBalance = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const tenantId = req.user.tenantId;
    const { year } = req.query;

    const balance = await leaveService.getLeaveBalance(userId, tenantId, year);

    return successResponse(res, balance);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get employee leave balance (admin)
 * @route   GET /api/v1/leaves/balance/:employeeId
 * @access  Private (HR/Admin only)
 */
export const getEmployeeLeaveBalance = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    const tenantId = req.user.tenantId;
    const { year } = req.query;

    const balance = await leaveService.getEmployeeLeaveBalance(
      employeeId,
      tenantId,
      year
    );

    return successResponse(res, balance);
  } catch (error) {
    next(error);
  }
};
