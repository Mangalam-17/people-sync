import auditLogRepository from '../repositories/auditLogRepository.js';
import logger from '../utils/logger.js';

class AuditService {
  /**
   * Log an audit event. Fire-and-forget — never throws.
   */
  async log({ tenantId, userId, action, resource, resourceId, details, ipAddress, userAgent }) {
    try {
      await auditLogRepository.create({
        tenantId,
        userId,
        action,
        resource,
        resourceId,
        details,
        ipAddress,
        userAgent,
      });
    } catch (error) {
      // Audit logging must never crash the request
      logger.error('Audit log failed:', { action, error: error.message });
    }
  }

  /**
   * Retrieve audit logs for a tenant (paginated).
   */
  async getAuditLogs(tenantId, filters) {
    return auditLogRepository.findByTenant(tenantId, filters);
  }

  /**
   * Retrieve audit logs for a specific user.
   */
  async getUserAuditLogs(tenantId, userId, filters) {
    return auditLogRepository.findByUser(tenantId, userId, filters);
  }
}

export default new AuditService();
