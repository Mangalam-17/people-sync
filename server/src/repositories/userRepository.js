import User from '../models/User.js';

class UserRepository {
  async create(data) {
    return User.create(data);
  }

  async findById(id, includeSecrets = false) {
    const query = User.findById(id);
    if (includeSecrets) {
      query.select('+password +loginAttempts +lockUntil +emailVerificationToken +emailVerificationExpires +passwordResetToken +passwordResetExpires');
    }
    return query;
  }

  async findByEmail(tenantId, email, includeSecrets = false) {
    const query = User.findOne({ tenantId, email });
    if (includeSecrets) {
      query.select('+password +loginAttempts +lockUntil +emailVerificationToken +emailVerificationExpires +passwordResetToken +passwordResetExpires');
    }
    return query;
  }

  async findByEmailAcrossTenants(email) {
    return User.findOne({ email });
  }

  async findByVerificationToken(token) {
    return User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
    }).select('+emailVerificationToken +emailVerificationExpires');
  }

  async findByResetToken(token) {
    return User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    }).select('+passwordResetToken +passwordResetExpires +password');
  }

  async update(id, data) {
    return User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async findByTenant(tenantId, { page = 1, limit = 20, search, role, isActive } = {}) {
    const filter = { tenantId };

    if (role) filter.role = role;
    if (typeof isActive === 'boolean') filter.isActive = isActive;
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(filter),
    ]);

    return { users, total, page, limit };
  }

  async countByTenant(tenantId) {
    return User.countDocuments({ tenantId, isActive: true });
  }

  async emailExistsInTenant(tenantId, email) {
    const count = await User.countDocuments({ tenantId, email });
    return count > 0;
  }
}

export default new UserRepository();
