import { Router } from 'express';
import userController from '../controllers/userController.js';
import authenticate from '../middlewares/authenticate.js';
import { authorize } from '../middlewares/authorize.js';
import { authorizeSelfOrRole } from '../middlewares/authorize.js';
import { validate, validateQuery } from '../middlewares/validate.js';
import { PERMISSIONS, ROLES } from '../config/constants.js';
import {
  createUserSchema,
  updateUserSchema,
  changeRoleSchema,
  listUsersQuerySchema,
} from '../validators/userValidator.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// List users (HR Admin+)
router.get(
  '/',
  authorize(PERMISSIONS.USER_READ),
  validateQuery(listUsersQuerySchema),
  userController.list
);

// Get user by ID (Self or HR Admin+)
router.get(
  '/:id',
  authorizeSelfOrRole(ROLES.SUPER_ADMIN, ROLES.HR_ADMIN),
  userController.getById
);

// Create user (HR Admin+)
router.post(
  '/',
  authorize(PERMISSIONS.USER_CREATE),
  validate(createUserSchema),
  userController.create
);

// Update user (Self limited fields, or HR Admin+ full)
router.patch(
  '/:id',
  authorizeSelfOrRole(ROLES.SUPER_ADMIN, ROLES.HR_ADMIN),
  validate(updateUserSchema),
  userController.update
);

// Change role (Super Admin only)
router.patch(
  '/:id/role',
  authorize(PERMISSIONS.USER_MANAGE_ROLES),
  validate(changeRoleSchema),
  userController.changeRole
);

// Deactivate user (Super Admin only)
router.delete(
  '/:id',
  authorize(PERMISSIONS.USER_DELETE),
  userController.deactivate
);

export default router;
