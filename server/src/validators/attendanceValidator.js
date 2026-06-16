import { body, query, param } from 'express-validator';

export const checkInValidator = [
  body('location.latitude')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Invalid latitude'),
  body('location.longitude')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Invalid longitude'),
  body('ipAddress')
    .optional()
    .isIP()
    .withMessage('Invalid IP address'),
  body('device')
    .optional()
    .isString()
    .trim(),
];

export const checkOutValidator = [
  body('location.latitude')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Invalid latitude'),
  body('location.longitude')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Invalid longitude'),
  body('ipAddress')
    .optional()
    .isIP()
    .withMessage('Invalid IP address'),
  body('device')
    .optional()
    .isString()
    .trim(),
];

export const getAttendanceValidator = [
  query('employeeId')
    .optional()
    .isMongoId()
    .withMessage('Invalid employee ID'),
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid start date'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid end date'),
  query('status')
    .optional()
    .isIn(['present', 'absent', 'late', 'half_day', 'on_leave'])
    .withMessage('Invalid status'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
];

export const markAbsentValidator = [
  body('employeeId')
    .notEmpty()
    .withMessage('Employee ID is required')
    .isMongoId()
    .withMessage('Invalid employee ID'),
  body('date')
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601()
    .withMessage('Invalid date format'),
  body('notes')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes must not exceed 500 characters'),
];

export const regularizationValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid attendance ID'),
  body('reason')
    .notEmpty()
    .withMessage('Reason is required')
    .isString()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Reason must be between 10 and 500 characters'),
];
