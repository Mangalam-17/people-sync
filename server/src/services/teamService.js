import teamRepository from '../repositories/teamRepository.js';
import departmentRepository from '../repositories/departmentRepository.js';
import auditService from './auditService.js';
import AppError from '../utils/AppError.js';

class TeamService {
  async list(tenantId, filters) {
    return teamRepository.findByTenant(tenantId, filters);
  }

  async listAll(tenantId) {
    return teamRepository.findAllByTenant(tenantId);
  }

  async getById(tenantId, id) {
    const team = await teamRepository.findById(id);
    if (!team || team.tenantId.toString() !== tenantId.toString()) {
      throw AppError.notFound('Team not found');
    }
    return team;
  }

  async getByDepartment(tenantId, departmentId) {
    return teamRepository.findByDepartment(tenantId, departmentId);
  }

  async create(tenantId, data, requestingUser, { ipAddress, userAgent }) {
    // Validate department exists
    const department = await departmentRepository.findById(data.departmentId);
    if (!department || department.tenantId.toString() !== tenantId.toString()) {
      throw AppError.badRequest('Department not found');
    }

    const nameExists = await teamRepository.nameExistsInDepartment(
      tenantId,
      data.departmentId,
      data.name
    );
    if (nameExists) {
      throw AppError.conflict('A team with this name already exists in this department');
    }

    const team = await teamRepository.create({ tenantId, ...data });
    const populated = await teamRepository.findById(team._id);

    await auditService.log({
      tenantId,
      userId: requestingUser.userId,
      action: 'team.created',
      resource: 'Team',
      resourceId: team._id,
      details: { name: data.name, department: department.name },
      ipAddress,
      userAgent,
    });

    return populated;
  }

  async update(tenantId, id, data, requestingUser, { ipAddress, userAgent }) {
    const team = await teamRepository.findById(id);
    if (!team || team.tenantId.toString() !== tenantId.toString()) {
      throw AppError.notFound('Team not found');
    }

    // If changing department, validate new department
    if (data.departmentId && data.departmentId.toString() !== team.departmentId._id.toString()) {
      const newDept = await departmentRepository.findById(data.departmentId);
      if (!newDept || newDept.tenantId.toString() !== tenantId.toString()) {
        throw AppError.badRequest('Target department not found');
      }
    }

    if (data.name && data.name !== team.name) {
      const deptId = data.departmentId || team.departmentId._id;
      const nameExists = await teamRepository.nameExistsInDepartment(tenantId, deptId, data.name, id);
      if (nameExists) {
        throw AppError.conflict('A team with this name already exists in this department');
      }
    }

    const updated = await teamRepository.update(id, data);

    await auditService.log({
      tenantId,
      userId: requestingUser.userId,
      action: 'team.updated',
      resource: 'Team',
      resourceId: id,
      details: { updatedFields: Object.keys(data) },
      ipAddress,
      userAgent,
    });

    return updated;
  }

  async delete(tenantId, id, requestingUser, { ipAddress, userAgent }) {
    const team = await teamRepository.findById(id);
    if (!team || team.tenantId.toString() !== tenantId.toString()) {
      throw AppError.notFound('Team not found');
    }

    await teamRepository.delete(id);

    await auditService.log({
      tenantId,
      userId: requestingUser.userId,
      action: 'team.deleted',
      resource: 'Team',
      resourceId: id,
      details: { name: team.name },
      ipAddress,
      userAgent,
    });

    return { message: 'Team deleted successfully' };
  }
}

export default new TeamService();
