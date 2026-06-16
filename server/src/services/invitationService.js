import invitationRepository from '../repositories/invitationRepository.js';
import Invitation from '../models/Invitation.js';
import AppError from '../utils/AppError.js';
import logger from '../utils/logger.js';

class InvitationService {
  /**
   * Create a new invitation
   */
  async createInvitation({
    companyName,
    email,
    firstName,
    lastName,
    plan = 'free',
    maxUsers = null,
    expiresInDays = 30,
    createdBy = 'system',
    notes = '',
  }) {
    // Generate unique code
    let code;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!isUnique && attempts < maxAttempts) {
      code = Invitation.generateCode();
      const existing = await invitationRepository.findByCode(code);
      if (!existing) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      throw AppError.internal('Failed to generate unique invitation code');
    }

    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    const invitation = await invitationRepository.create({
      code,
      companyName,
      email,
      firstName,
      lastName,
      plan,
      maxUsers,
      expiresAt,
      createdBy,
      notes,
    });

    logger.info(`📨 Invitation created: ${code} for ${companyName} (${email})`);

    return invitation;
  }

  /**
   * Validate invitation code
   */
  async validateInvitation(code) {
    if (!code) {
      throw AppError.badRequest('Invitation code is required', 'INVITATION_REQUIRED');
    }

    const invitation = await invitationRepository.findByCode(code);

    if (!invitation) {
      throw AppError.notFound('Invalid invitation code', 'INVITATION_NOT_FOUND');
    }

    if (invitation.isUsed) {
      throw AppError.badRequest(
        'This invitation has already been used',
        'INVITATION_ALREADY_USED'
      );
    }

    if (invitation.isExpired) {
      throw AppError.badRequest(
        'This invitation has expired',
        'INVITATION_EXPIRED'
      );
    }

    return invitation;
  }

  /**
   * Get invitation by code (public - shows limited info)
   */
  async getInvitationByCode(code) {
    const invitation = await this.validateInvitation(code);

    return {
      companyName: invitation.companyName,
      email: invitation.email,
      firstName: invitation.firstName,
      lastName: invitation.lastName,
      plan: invitation.plan,
      expiresAt: invitation.expiresAt,
    };
  }

  /**
   * Use invitation (mark as used)
   */
  async useInvitation(code, userId, tenantId) {
    const invitation = await this.validateInvitation(code);
    await invitation.markAsUsed(userId, tenantId);

    logger.info(`✅ Invitation ${code} used by user ${userId} for tenant ${tenantId}`);

    return invitation;
  }

  /**
   * List all invitations (admin only)
   */
  async listInvitations(filters) {
    return invitationRepository.list(filters);
  }

  /**
   * Get invitation statistics (admin only)
   */
  async getStatistics() {
    return invitationRepository.getStats();
  }

  /**
   * Delete invitation (admin only)
   */
  async deleteInvitation(id) {
    const invitation = await Invitation.findById(id);

    if (!invitation) {
      throw AppError.notFound('Invitation not found');
    }

    if (invitation.isUsed) {
      throw AppError.badRequest('Cannot delete used invitations');
    }

    await invitationRepository.delete(id);

    logger.info(`🗑️ Invitation deleted: ${invitation.code}`);

    return { message: 'Invitation deleted successfully' };
  }

  /**
   * Bulk create invitations
   */
  async bulkCreateInvitations(invitations) {
    const results = {
      created: [],
      failed: [],
    };

    for (const inv of invitations) {
      try {
        const created = await this.createInvitation(inv);
        results.created.push(created);
      } catch (error) {
        results.failed.push({
          ...inv,
          error: error.message,
        });
      }
    }

    return results;
  }
}

export default new InvitationService();
