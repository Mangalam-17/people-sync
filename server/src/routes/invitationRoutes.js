import express from 'express';
import invitationController from '../controllers/invitationController.js';
import authenticate from '../middlewares/authenticate.js';
import { authorizeRole } from '../middlewares/authorize.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

/**
 * @route   GET /api/v1/invitations/validate/:code
 * @desc    Validate invitation code (public endpoint)
 * @access  Public
 */
router.get('/validate/:code', invitationController.validate);

/**
 * @route   GET /api/v1/invitations/stats
 * @desc    Get invitation statistics
 * @access  Private (Super Admin only)
 */
router.get(
  '/stats',
  authenticate,
  authorizeRole(ROLES.SUPER_ADMIN),
  invitationController.getStats
);

/**
 * @route   GET /api/v1/invitations
 * @desc    List all invitations with filters
 * @access  Private (Super Admin only)
 */
router.get(
  '/',
  authenticate,
  authorizeRole(ROLES.SUPER_ADMIN),
  invitationController.list
);

/**
 * @route   POST /api/v1/invitations
 * @desc    Create a new invitation
 * @access  Private (Super Admin only)
 */
router.post(
  '/',
  authenticate,
  authorizeRole(ROLES.SUPER_ADMIN),
  invitationController.create
);

/**
 * @route   POST /api/v1/invitations/bulk
 * @desc    Bulk create invitations
 * @access  Private (Super Admin only)
 */
router.post(
  '/bulk',
  authenticate,
  authorizeRole(ROLES.SUPER_ADMIN),
  invitationController.bulkCreate
);

/**
 * @route   DELETE /api/v1/invitations/:id
 * @desc    Delete invitation
 * @access  Private (Super Admin only)
 */
router.delete(
  '/:id',
  authenticate,
  authorizeRole(ROLES.SUPER_ADMIN),
  invitationController.delete
);

export default router;
