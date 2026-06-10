import { Router } from 'express';
import employeeController from '../controllers/employeeController.js';
import authenticate from '../middlewares/authenticate.js';
import { authorize } from '../middlewares/authorize.js';
import { validate, validateQuery } from '../middlewares/validate.js';
import { PERMISSIONS } from '../config/constants.js';
import {
  onboardEmployeeSchema,
  listEmployeesQuerySchema,
} from '../validators/employeeValidator.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// List employees
router.get(
  '/',
  authorize(PERMISSIONS.USER_READ),
  validateQuery(listEmployeesQuerySchema),
  employeeController.list
);

// Get employee profile
router.get(
  '/:id',
  authorize(PERMISSIONS.USER_READ),
  employeeController.getById
);

// Onboard new employee
router.post(
  '/onboard',
  authorize(PERMISSIONS.USER_CREATE),
  validate(onboardEmployeeSchema),
  employeeController.onboard
);

export default router;
