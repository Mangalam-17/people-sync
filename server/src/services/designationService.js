import designationRepository from '../repositories/designationRepository.js';
import auditService from './auditService.js';
import AppError from '../utils/AppError.js';

class DesignationService {
  async list(tenantId, filters) {
    return designationRepository.findByTenant(tenantId, filters);
  }

  async listAll(tenantId) {
    return designationRepository.findAllByTenant(tenantId);
  }

  async getById(tenantId, id) {
    const designation = await designationRepository.findById(id);
    if (!designation || designation.tenantId.toString() !== tenantId.toString()) {
      throw AppError.notFound('Designation not found');
    }
    return designation;
  }

  async create(tenantId, data, requestingUser, { ipAddress, userAgent }) {
    const titleExists = await designationRepository.titleExistsInTenant(tenantId, data.title);
    if (titleExists) {
      throw AppError.conflict('A designation with this title already exists');
    }

    const designation = await designationRepository.create({ tenantId, ...data });

    await auditService.log({
      tenantId,
      userId: requestingUser.userId,
      action: 'designation.created',
      resource: 'Designation',
      resourceId: designation._id,
      details: { title: data.title, level: data.level },
      ipAddress,
      userAgent,
    });

    return designation;
  }

  async update(tenantId, id, data, requestingUser, { ipAddress, userAgent }) {
    const designation = await designationRepository.findById(id);
    if (!designation || designation.tenantId.toString() !== tenantId.toString()) {
      throw AppError.notFound('Designation not found');
    }

    if (data.title && data.title !== designation.title) {
      const titleExists = await designationRepository.titleExistsInTenant(tenantId, data.title, id);
      if (titleExists) {
        throw AppError.conflict('A designation with this title already exists');
      }
    }

    const updated = await designationRepository.update(id, data);

    await auditService.log({
      tenantId,
      userId: requestingUser.userId,
      action: 'designation.updated',
      resource: 'Designation',
      resourceId: id,
      details: { updatedFields: Object.keys(data) },
      ipAddress,
      userAgent,
    });

    return updated;
  }

  async delete(tenantId, id, requestingUser, { ipAddress, userAgent }) {
    const designation = await designationRepository.findById(id);
    if (!designation || designation.tenantId.toString() !== tenantId.toString()) {
      throw AppError.notFound('Designation not found');
    }

    await designationRepository.delete(id);

    await auditService.log({
      tenantId,
      userId: requestingUser.userId,
      action: 'designation.deleted',
      resource: 'Designation',
      resourceId: id,
      details: { title: designation.title },
      ipAddress,
      userAgent,
    });

    return { message: 'Designation deleted successfully' };
  }
}

export default new DesignationService();
