import RefreshToken from '../models/RefreshToken.js';

class RefreshTokenRepository {
  async create(data) {
    return RefreshToken.create(data);
  }

  async findByTokenHash(tokenHash) {
    return RefreshToken.findOne({ tokenHash, isRevoked: false });
  }

  async findByFamily(family) {
    return RefreshToken.find({ family }).sort({ createdAt: -1 });
  }

  async revokeByTokenHash(tokenHash) {
    return RefreshToken.findOneAndUpdate(
      { tokenHash },
      { isRevoked: true },
      { new: true }
    );
  }

  async revokeAllByFamily(family) {
    return RefreshToken.updateMany({ family }, { isRevoked: true });
  }

  async revokeAllByUser(userId) {
    return RefreshToken.updateMany({ userId }, { isRevoked: true });
  }

  async revokeAllByTenant(tenantId) {
    return RefreshToken.updateMany({ tenantId }, { isRevoked: true });
  }

  async deleteExpired() {
    return RefreshToken.deleteMany({ expiresAt: { $lt: new Date() } });
  }

  async countActiveByUser(userId) {
    return RefreshToken.countDocuments({ userId, isRevoked: false, expiresAt: { $gt: new Date() } });
  }
}

export default new RefreshTokenRepository();
