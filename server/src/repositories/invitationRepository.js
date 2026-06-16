import Invitation from '../models/Invitation.js';

class InvitationRepository {
  /**
   * Create a new invitation
   */
  async create(invitationData) {
    const invitation = new Invitation(invitationData);
    return invitation.save();
  }

  /**
   * Find invitation by code
   */
  async findByCode(code) {
    return Invitation.findOne({ code: code.toUpperCase() });
  }

  /**
   * Find valid invitation by code (not used, not expired)
   */
  async findValidByCode(code) {
    return Invitation.findOne({
      code: code.toUpperCase(),
      isUsed: false,
      expiresAt: { $gt: new Date() },
    });
  }

  /**
   * List all invitations with pagination
   */
  async list({ page = 1, limit = 20, status = 'all', search = '' }) {
    const skip = (page - 1) * limit;
    const query = {};

    // Filter by status
    if (status === 'valid') {
      query.isUsed = false;
      query.expiresAt = { $gt: new Date() };
    } else if (status === 'used') {
      query.isUsed = true;
    } else if (status === 'expired') {
      query.isUsed = false;
      query.expiresAt = { $lte: new Date() };
    }

    // Search
    if (search) {
      query.$or = [
        { code: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const [invitations, total] = await Promise.all([
      Invitation.find(query)
        .populate('usedBy', 'firstName lastName email')
        .populate('tenantId', 'name slug')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Invitation.countDocuments(query),
    ]);

    return {
      data: invitations,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Mark invitation as used
   */
  async markAsUsed(code, userId, tenantId) {
    return Invitation.findOneAndUpdate(
      { code: code.toUpperCase() },
      {
        isUsed: true,
        usedAt: new Date(),
        usedBy: userId,
        tenantId: tenantId,
      },
      { new: true }
    );
  }

  /**
   * Delete invitation
   */
  async delete(id) {
    return Invitation.findByIdAndDelete(id);
  }

  /**
   * Get statistics
   */
  async getStats() {
    const now = new Date();
    
    const [total, used, expired, valid] = await Promise.all([
      Invitation.countDocuments(),
      Invitation.countDocuments({ isUsed: true }),
      Invitation.countDocuments({ isUsed: false, expiresAt: { $lte: now } }),
      Invitation.countDocuments({ isUsed: false, expiresAt: { $gt: now } }),
    ]);

    return {
      total,
      used,
      expired,
      valid,
      pending: valid,
    };
  }

  /**
   * Expire old invitations (cleanup job)
   */
  async expireOldInvitations() {
    const result = await Invitation.updateMany(
      {
        isUsed: false,
        expiresAt: { $lte: new Date() },
      },
      {
        $set: { notes: 'Auto-expired by system' },
      }
    );
    return result.modifiedCount;
  }
}

export default new InvitationRepository();
