import express from 'express';
import analyticsController from '../controllers/analyticsController.js';
import authenticate from '../middlewares/authenticate.js';
import { authorizeRole } from '../middlewares/authorize.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

/**
 * @route   GET /api/v1/analytics/dashboard
 * @desc    Get dashboard analytics
 * @access  Private (All roles)
 */
router.get(
  '/dashboard',
  authenticate,
  analyticsController.getDashboardAnalytics
);

/**
 * @route   GET /api/v1/analytics/attendance-trend
 * @desc    Get attendance trend for specified days
 * @access  Private (Admin, HR Admin, Manager)
 */
router.get(
  '/attendance-trend',
  authenticate,
  authorizeRole(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.HR_ADMIN, ROLES.MANAGER),
  analyticsController.getAttendanceTrend
);

/**
 * @route   GET /api/v1/analytics/attendance-report
 * @desc    Get monthly attendance report
 * @access  Private (Admin, HR Admin)
 */
router.get(
  '/attendance-report',
  authenticate,
  authorizeRole(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.HR_ADMIN),
  analyticsController.getMonthlyAttendanceReport
);

/**
 * @route   GET /api/v1/analytics/department
 * @desc    Get department-wise analytics
 * @access  Private (Admin, HR Admin)
 */
router.get(
  '/department',
  authenticate,
  authorizeRole(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.HR_ADMIN),
  analyticsController.getDepartmentAnalytics
);

/**
 * @route   GET /api/v1/analytics/growth-trend
 * @desc    Get employee growth trend
 * @access  Private (Admin, HR Admin)
 */
router.get(
  '/growth-trend',
  authenticate,
  authorizeRole(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.HR_ADMIN),
  analyticsController.getEmployeeGrowthTrend
);

/**
 * @route   GET /api/v1/analytics/personal
 * @desc    Get personal analytics for logged-in employee
 * @access  Private (Employee, Manager, Admin, HR Admin)
 */
router.get(
  '/personal',
  authenticate,
  authorizeRole(ROLES.EMPLOYEE, ROLES.MANAGER, ROLES.ADMIN, ROLES.HR_ADMIN),
  analyticsController.getPersonalAnalytics
);

export default router;
