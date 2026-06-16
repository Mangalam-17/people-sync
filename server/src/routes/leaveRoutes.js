import express from 'express';
import * as leaveController from '../controllers/leaveController.js';
import * as leaveValidator from '../validators/leaveValidator.js';
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

// Apply for leave
router.post(
  '/',
  leaveValidator.applyLeaveValidator,
  handleValidation,
  leaveController.applyLeave
);

// Get leave requests
router.get(
  '/',
  leaveValidator.getLeaveRequestsValidator,
  handleValidation,
  leaveController.getLeaveRequests
);

// Get pending leaves (HR/Manager only)
router.get(
  '/pending',
  authorizeRole('super_admin', 'hr_admin', 'manager'),
  leaveController.getPendingLeaves
);

// Get leave balance
router.get(
  '/balance',
  leaveValidator.getLeaveBalanceValidator,
  handleValidation,
  leaveController.getLeaveBalance
);

// Get employee leave balance (HR/Admin only)
router.get(
  '/balance/:employeeId',
  authorizeRole('super_admin', 'hr_admin', 'manager'),
  leaveValidator.getEmployeeLeaveBalanceValidator,
  handleValidation,
  leaveController.getEmployeeLeaveBalance
);

// Review leave (HR/Manager only)
router.patch(
  '/:id/review',
  authorizeRole('super_admin', 'hr_admin', 'manager'),
  leaveValidator.reviewLeaveValidator,
  handleValidation,
  leaveController.reviewLeave
);

// Cancel leave
router.patch(
  '/:id/cancel',
  leaveValidator.cancelLeaveValidator,
  handleValidation,
  leaveController.cancelLeave
);

export default router;
