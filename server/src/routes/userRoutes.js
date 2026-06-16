import express from 'express';
import userController from '../controllers/userController.js';
import authenticate from '../middlewares/authenticate.js';
import { authorizeRole } from '../middlewares/authorize.js';
import { validate, validateQuery } from '../middlewares/validate.js';
import { updateRoleSchema, listUsersQuerySchema } from '../validators/userValidator.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/v1/users
 * @desc    List all users (HR_ADMIN, SUPER_ADMIN only)
 * @access  Private
 */
router.get(
  '/',
  authorizeRole(ROLES.HR_ADMIN, ROLES.SUPER_ADMIN),
  validateQuery(listUsersQuerySchema),
  userController.list
);

/**
 * @route   PATCH /api/v1/users/:userId/role
 * @desc    Update user role (HR_ADMIN, SUPER_ADMIN only)
 * @access  Private
 */
router.patch(
  '/:userId/role',
  authorizeRole(ROLES.HR_ADMIN, ROLES.SUPER_ADMIN),
  validate(updateRoleSchema),
  userController.updateRole
);

export default router;
