import { body, query, param } from 'express-validator';

export const applyLeaveValidator = [
  body('leaveType')
    .notEmpty()
    .withMessage('Leave type is required')
    .isIn(['sick', 'casual', 'earned', 'unpaid', 'maternity', 'paternity', 'bereavement', 'compensatory'])
    .withMessage('Invalid leave type'),
  body('startDate')
    .notEmpty()
    .withMessage('Start date is required')
    .isISO8601()
    .withMessage('Invalid start date format'),
  body('endDate')
    .notEmpty()
    .withMessage('End date is required')
    .isISO8601()
    .withMessage('Invalid end date format')
    .custom((endDate, { req }) => {
      if (new Date(endDate) < new Date(req.body.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  body('isHalfDay')
    .optional()
    .isBoolean()
    .withMessage('isHalfDay must be a boolean'),
  body('halfDaySession')
    .optional()
    .isIn(['morning', 'afternoon'])
    .withMessage('Invalid half day session'),
  body('reason')
    .notEmpty()
    .withMessage('Reason is required')
    .isString()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Reason must be between 10 and 1000 characters'),
  body('contactDuringLeave.phone')
    .optional()
    .isMobilePhone()
    .withMessage('Invalid phone number'),
  body('contactDuringLeave.email')
    .optional()
    .isEmail()
    .withMessage('Invalid email'),
  body('contactDuringLeave.address')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Address must not exceed 500 characters'),
];

export const getLeaveRequestsValidator = [
  query('employeeId')
    .optional()
    .isMongoId()
    .withMessage('Invalid employee ID'),
  query('status')
    .optional()
    .isIn(['pending', 'approved', 'rejected', 'cancelled'])
    .withMessage('Invalid status'),
  query('leaveType')
    .optional()
    .isIn(['sick', 'casual', 'earned', 'unpaid', 'maternity', 'paternity', 'bereavement', 'compensatory'])
    .withMessage('Invalid leave type'),
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid start date'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid end date'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
];

export const reviewLeaveValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid leave ID'),
  body('decision')
    .notEmpty()
    .withMessage('Decision is required')
    .isIn(['approved', 'rejected'])
    .withMessage('Decision must be either approved or rejected'),
  body('reviewNotes')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Review notes must not exceed 500 characters'),
];

export const cancelLeaveValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid leave ID'),
];

export const getLeaveBalanceValidator = [
  query('year')
    .optional()
    .isInt({ min: 2000, max: 2100 })
    .withMessage('Invalid year'),
];

export const getEmployeeLeaveBalanceValidator = [
  param('employeeId')
    .isMongoId()
    .withMessage('Invalid employee ID'),
  query('year')
    .optional()
    .isInt({ min: 2000, max: 2100 })
    .withMessage('Invalid year'),
];
