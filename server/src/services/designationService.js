import designationRepository from '../repositories/designationRepository.js';
import departmentRepository from '../repositories/departmentRepository.js';
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
    if (!data.departmentId) {
      throw AppError.badRequest('Department ID is required');
    }
    const department = await departmentRepository.findById(data.departmentId);
    if (!department || department.tenantId.toString() !== tenantId.toString()) {
      throw AppError.notFound('Department not found');
    }

    const titleExists = await designationRepository.titleExistsInDepartment(tenantId, data.departmentId, data.title);
    if (titleExists) {
      throw AppError.conflict('A designation with this title already exists in this department');
    }

    const designation = await designationRepository.create({ tenantId, ...data });

    await auditService.log({
      tenantId,
      userId: requestingUser.userId,
      action: 'designation.created',
      resource: 'Designation',
      resourceId: designation._id,
      details: { title: data.title, level: data.level, departmentId: data.departmentId },
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

    if (data.departmentId && data.departmentId !== designation.departmentId.toString()) {
      const department = await departmentRepository.findById(data.departmentId);
      if (!department || department.tenantId.toString() !== tenantId.toString()) {
        throw AppError.notFound('Department not found');
      }
    }

    const targetDepartmentId = data.departmentId || designation.departmentId;
    const targetTitle = data.title || designation.title;

    if (data.title || data.departmentId) {
      const titleExists = await designationRepository.titleExistsInDepartment(tenantId, targetDepartmentId, targetTitle, id);
      if (titleExists) {
        throw AppError.conflict('A designation with this title already exists in this department');
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
