import AuditLog from '../models/AuditLog.js';

class AuditLogRepository {
  async create(data) {
    return AuditLog.create(data);
  }

  async findByTenant(tenantId, { page = 1, limit = 50, action, userId, startDate, endDate } = {}) {
    const filter = { tenantId };

    if (action) filter.action = action;
    if (userId) filter.userId = userId;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
      AuditLog.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'firstName lastName email'),
      AuditLog.countDocuments(filter),
    ]);

    return { logs, total, page, limit };
  }

  async findByUser(tenantId, userId, { page = 1, limit = 50 } = {}) {
    return this.findByTenant(tenantId, { page, limit, userId });
  }
}

export default new AuditLogRepository();
