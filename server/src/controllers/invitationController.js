import invitationService from '../services/invitationService.js';
import { successResponse, createdResponse } from '../utils/responseFormatter.js';

class InvitationController {
  /**
   * POST /api/v1/invitations
   * Create a new invitation (Super Admin only)
   */
  async create(req, res, next) {
    try {
      const invitation = await invitationService.createInvitation({
        ...req.body,
        createdBy: req.user.email || 'admin',
      });

      return createdResponse(res, { invitation }, 'Invitation created successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/invitations
   * List all invitations (Super Admin only)
   */
  async list(req, res, next) {
    try {
      const { page, limit, status, search } = req.query;

      const result = await invitationService.listInvitations({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20,
        status: status || 'all',
        search: search || '',
      });

      return successResponse(res, result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/invitations/stats
   * Get invitation statistics (Super Admin only)
   */
  async getStats(req, res, next) {
    try {
      const stats = await invitationService.getStatistics();
      return successResponse(res, { stats });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/invitations/validate/:code
   * Validate invitation code (Public)
   */
  async validate(req, res, next) {
    try {
      const { code } = req.params;
      const invitation = await invitationService.getInvitationByCode(code);
      
      return successResponse(res, { invitation }, 'Invitation is valid');
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/invitations/:id
   * Delete invitation (Super Admin only)
   */
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const result = await invitationService.deleteInvitation(id);
      
      return successResponse(res, null, result.message);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/invitations/bulk
   * Bulk create invitations (Super Admin only)
   */
  async bulkCreate(req, res, next) {
    try {
      const { invitations } = req.body;
      
      if (!Array.isArray(invitations) || invitations.length === 0) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_INPUT',
            message: 'Invitations array is required and must not be empty',
          },
        });
      }

      const result = await invitationService.bulkCreateInvitations(
        invitations.map(inv => ({
          ...inv,
          createdBy: req.user.email || 'admin',
        }))
      );

      return successResponse(
        res,
        result,
        `Created ${result.created.length} invitations. ${result.failed.length} failed.`
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new InvitationController();
