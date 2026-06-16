import attendanceService from '../services/attendanceService.js';
import { successResponse, createdResponse } from '../utils/responseFormatter.js';
import logger from '../utils/logger.js';

/**
 * @desc    Check in
 * @route   POST /api/v1/attendance/check-in
 * @access  Private (Employee)
 */
export const checkIn = async (req, res, next) => {
  try {
    const { location, ipAddress, device } = req.body;
    const userId = req.user.userId;
    const tenantId = req.user.tenantId;

    logger.info(`✅ Check-in request from user ${userId}`);

    const attendance = await attendanceService.checkIn(userId, tenantId, {
      location,
      ipAddress: ipAddress || req.ip,
      device: device || req.get('User-Agent'),
    });

    return createdResponse(res, attendance, 'Checked in successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Check out
 * @route   POST /api/v1/attendance/check-out
 * @access  Private (Employee)
 */
export const checkOut = async (req, res, next) => {
  try {
    const { location, ipAddress, device } = req.body;
    const userId = req.user.userId;
    const tenantId = req.user.tenantId;

    logger.info(`✅ Check-out request from user ${userId}`);

    const attendance = await attendanceService.checkOut(userId, tenantId, {
      location,
      ipAddress: ipAddress || req.ip,
      device: device || req.get('User-Agent'),
    });

    return successResponse(res, attendance, 'Checked out successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get today's attendance status
 * @route   GET /api/v1/attendance/today
 * @access  Private (Employee)
 */
export const getTodayStatus = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const tenantId = req.user.tenantId;

    const attendance = await attendanceService.getTodayStatus(userId, tenantId);

    return successResponse(res, attendance);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get today's organization attendance summary
 * @route   GET /api/v1/attendance/today/summary
 * @access  Private (Admin/HR/Manager only)
 */
export const getTodayOrgSummary = async (req, res, next) => {
  try {
    const tenantId = req.user.tenantId;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const summary = await attendanceService.getTodayOrgSummary(tenantId, today);

    return successResponse(res, summary);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get attendance records
 * @route   GET /api/v1/attendance
 * @access  Private (Employee for own, HR/Manager for all)
 */
export const getAttendanceRecords = async (req, res, next) => {
  try {
    const tenantId = req.user.tenantId;
    const { employeeId, startDate, endDate, status, page, limit } = req.query;

    // If not admin/hr, only allow viewing own records
    let finalEmployeeId = employeeId;
    if (!['super_admin', 'hr_admin', 'manager'].includes(req.user.role)) {
      const EmployeeProfile = (await import('../models/EmployeeProfile.js')).default;
      const employee = await EmployeeProfile.findOne({ userId: req.user.userId, tenantId: tenantId });
      if (employee) {
        finalEmployeeId = employee._id.toString();
      }
    }

    const result = await attendanceService.getAttendanceRecords(tenantId, {
      employeeId: finalEmployeeId,
      startDate,
      endDate,
      status,
      page,
      limit,
    });

    return successResponse(res, {
      records: result.records,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get attendance summary
 * @route   GET /api/v1/attendance/summary
 * @access  Private
 */
export const getAttendanceSummary = async (req, res, next) => {
  try {
    const tenantId = req.user.tenantId;
    const { employeeId, startDate, endDate } = req.query;

    // If not admin/hr, only allow viewing own summary
    let finalEmployeeId = employeeId;
    if (!['super_admin', 'hr_admin', 'manager'].includes(req.user.role)) {
      const EmployeeProfile = (await import('../models/EmployeeProfile.js')).default;
      const employee = await EmployeeProfile.findOne({ userId: req.user.userId, tenantId: tenantId });
      if (employee) {
        finalEmployeeId = employee._id.toString();
      }
    }

    const summary = await attendanceService.getAttendanceSummary(tenantId, {
      employeeId: finalEmployeeId,
      startDate,
      endDate,
    });

    return successResponse(res, summary);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mark employee as absent
 * @route   POST /api/v1/attendance/mark-absent
 * @access  Private (HR/Admin only)
 */
export const markAbsent = async (req, res, next) => {
  try {
    const { employeeId, date, notes } = req.body;
    const tenantId = req.user.tenantId;

    logger.info(`📝 Marking employee ${employeeId} as absent`);

    const attendance = await attendanceService.markAbsent(
      employeeId,
      tenantId,
      date,
      notes
    );

    return createdResponse(res, attendance, 'Employee marked as absent');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Request regularization
 * @route   POST /api/v1/attendance/:id/regularize
 * @access  Private (Employee)
 */
export const requestRegularization = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user.userId;
    const tenantId = req.user.tenantId;

    logger.info(`📝 Regularization request for attendance ${id}`);

    const attendance = await attendanceService.requestRegularization(
      id,
      userId,
      tenantId,
      reason
    );

    return successResponse(res, attendance, 'Regularization request submitted');
  } catch (error) {
    next(error);
  }
};
