import analyticsService from '../services/analyticsService.js';
import { successResponse } from '../utils/responseFormatter.js';
import AppError from '../utils/AppError.js';

/**
 * Get dashboard analytics
 */
export const getDashboardAnalytics = async (req, res, next) => {
  try {
    const { tenantId, _id: userId, role } = req.user;

    const analytics = await analyticsService.getDashboardAnalytics(tenantId, userId, role);

    return successResponse(res, analytics, 'Dashboard analytics retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get attendance trend
 */
export const getAttendanceTrend = async (req, res, next) => {
  try {
    const { tenantId } = req.user;
    const { days = 7 } = req.query;

    const trend = await analyticsService.getAttendanceTrend(tenantId, parseInt(days));

    return successResponse(res, trend, 'Attendance trend retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get monthly attendance report
 */
export const getMonthlyAttendanceReport = async (req, res, next) => {
  try {
    const { tenantId } = req.user;
    const { month, year } = req.query;

    if (!month || !year) {
      throw new AppError('Month and year are required', 400);
    }

    const report = await analyticsService.getMonthlyAttendanceReport(
      tenantId,
      parseInt(month),
      parseInt(year)
    );

    return successResponse(res, report, 'Monthly attendance report retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get department analytics
 */
export const getDepartmentAnalytics = async (req, res, next) => {
  try {
    const { tenantId } = req.user;

    const analytics = await analyticsService.getDepartmentAnalytics(tenantId);

    return successResponse(res, analytics, 'Department analytics retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get employee growth trend
 */
export const getEmployeeGrowthTrend = async (req, res, next) => {
  try {
    const { tenantId } = req.user;

    const trend = await analyticsService.getEmployeeGrowthTrend(tenantId);

    return successResponse(res, trend, 'Employee growth trend retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get personal analytics (for individual employee)
 */
export const getPersonalAnalytics = async (req, res, next) => {
  try {
    const { tenantId, _id: userId } = req.user;

    const analytics = await analyticsService.getPersonalAnalytics(tenantId, userId);

    return successResponse(res, analytics, 'Personal analytics retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export default {
  getDashboardAnalytics,
  getAttendanceTrend,
  getMonthlyAttendanceReport,
  getDepartmentAnalytics,
  getEmployeeGrowthTrend,
  getPersonalAnalytics,
};
