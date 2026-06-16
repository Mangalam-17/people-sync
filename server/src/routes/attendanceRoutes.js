import express from 'express';
import * as attendanceController from '../controllers/attendanceController.js';
import * as attendanceValidator from '../validators/attendanceValidator.js';
import authenticate from '../middlewares/authenticate.js';
import { authorizeRole } from '../middlewares/authorize.js';
import { validationResult } from 'express-validator';

const router = express.Router();

// Validation middleware to handle express-validator results
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

// All routes require authentication
router.use(authenticate);

// Check in/out
router.post(
  '/check-in',
  attendanceValidator.checkInValidator,
  handleValidation,
  attendanceController.checkIn
);

router.post(
  '/check-out',
  attendanceValidator.checkOutValidator,
  handleValidation,
  attendanceController.checkOut
);

// Get today's status
router.get('/today', attendanceController.getTodayStatus);

// Get today's organization summary (Admin/HR/Manager only)
router.get(
  '/today/summary',
  authorizeRole('super_admin', 'hr_admin', 'manager'),
  attendanceController.getTodayOrgSummary
);

// Get attendance records
router.get(
  '/',
  attendanceValidator.getAttendanceValidator,
  handleValidation,
  attendanceController.getAttendanceRecords
);

// Get attendance summary
router.get(
  '/summary',
  attendanceValidator.getAttendanceValidator,
  handleValidation,
  attendanceController.getAttendanceSummary
);

// Mark absent (HR/Admin only)
router.post(
  '/mark-absent',
  authorizeRole('super_admin', 'hr_admin'),
  attendanceValidator.markAbsentValidator,
  handleValidation,
  attendanceController.markAbsent
);

// Request regularization
router.post(
  '/:id/regularize',
  attendanceValidator.regularizationValidator,
  handleValidation,
  attendanceController.requestRegularization
);

export default router;
