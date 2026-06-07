import departmentRepository from '../repositories/departmentRepository.js';
import teamRepository from '../repositories/teamRepository.js';
import auditService from './auditService.js';
import AppError from '../utils/AppError.js';

class DepartmentService {
  async list(tenantId, filters) {
    return departmentRepository.findByTenant(tenantId, filters);
  }

  async listAll(tenantId) {
    return departmentRepository.findAllByTenant(tenantId);
  }

  async getById(tenantId, id) {
    const department = await departmentRepository.findById(id);
    if (!department || department.tenantId.toString() !== tenantId.toString()) {
      throw AppError.notFound('Department not found');
    }
    return department;
  }

  async create(tenantId, data, requestingUser, { ipAddress, userAgent }) {
    const nameExists = await departmentRepository.nameExistsInTenant(tenantId, data.name);
    if (nameExists) {
      throw AppError.conflict('A department with this name already exists');
    }

    if (data.code) {
      const codeExists = await departmentRepository.codeExistsInTenant(tenantId, data.code);
      if (codeExists) {
        throw AppError.conflict('A department with this code already exists');
      }
    }

    // Validate parent department exists if specified
    if (data.parentId) {
      const parent = await departmentRepository.findById(data.parentId);
      if (!parent || parent.tenantId.toString() !== tenantId.toString()) {
        throw AppError.badRequest('Parent department not found');
      }
    }

    const department = await departmentRepository.create({ tenantId, ...data });

    await auditService.log({
      tenantId,
      userId: requestingUser.userId,
      action: 'department.created',
      resource: 'Department',
      resourceId: department._id,
      details: { name: data.name, code: data.code },
      ipAddress,
      userAgent,
    });

    return department;
  }

  async update(tenantId, id, data, requestingUser, { ipAddress, userAgent }) {
    const department = await departmentRepository.findById(id);
    if (!department || department.tenantId.toString() !== tenantId.toString()) {
      throw AppError.notFound('Department not found');
    }

    if (data.name && data.name !== department.name) {
      const nameExists = await departmentRepository.nameExistsInTenant(tenantId, data.name, id);
      if (nameExists) {
        throw AppError.conflict('A department with this name already exists');
      }
    }

    if (data.code && data.code !== department.code) {
      const codeExists = await departmentRepository.codeExistsInTenant(tenantId, data.code, id);
      if (codeExists) {
        throw AppError.conflict('A department with this code already exists');
      }
    }

    // Prevent circular parent reference
    if (data.parentId && data.parentId.toString() === id.toString()) {
      throw AppError.badRequest('A department cannot be its own parent');
    }

    const updated = await departmentRepository.update(id, data);

    await auditService.log({
      tenantId,
      userId: requestingUser.userId,
      action: 'department.updated',
      resource: 'Department',
      resourceId: id,
      details: { updatedFields: Object.keys(data) },
      ipAddress,
      userAgent,
    });

    return updated;
  }

  async delete(tenantId, id, requestingUser, { ipAddress, userAgent }) {
    const department = await departmentRepository.findById(id);
    if (!department || department.tenantId.toString() !== tenantId.toString()) {
      throw AppError.notFound('Department not found');
    }

    // Check for child teams
    const teamCount = await teamRepository.countByDepartment(id);
    if (teamCount > 0) {
      throw AppError.conflict(
        `Cannot delete department with ${teamCount} active team(s). Remove or reassign teams first.`
      );
    }

    // Check for child departments
    const { departments: children } = await departmentRepository.findByTenant(tenantId, { parentId: id });
    if (children.length > 0) {
      throw AppError.conflict(
        'Cannot delete department with child departments. Remove or reassign them first.'
      );
    }

    await departmentRepository.delete(id);

    await auditService.log({
      tenantId,
      userId: requestingUser.userId,
      action: 'department.deleted',
      resource: 'Department',
      resourceId: id,
      details: { name: department.name },
      ipAddress,
      userAgent,
    });

    return { message: 'Department deleted successfully' };
  }

  async getOrgChart(tenantId) {
    const departments = await departmentRepository.getHierarchy(tenantId);
    const teams = await teamRepository.findAllByTenant(tenantId);

    // Build tree structure
    const deptMap = new Map();
    const roots = [];

    departments.forEach((dept) => {
      deptMap.set(dept._id.toString(), {
        ...dept,
        type: 'department',
        children: [],
        teams: [],
      });
    });

    // Attach teams to departments
    teams.forEach((team) => {
      const deptNode = deptMap.get(team.departmentId?.toString());
      if (deptNode) {
        deptNode.teams.push({ ...team.toJSON(), type: 'team' });
      }
    });

    // Build parent-child tree
    departments.forEach((dept) => {
      const node = deptMap.get(dept._id.toString());
      if (dept.parentId) {
        const parent = deptMap.get(dept.parentId.toString());
        if (parent) {
          parent.children.push(node);
        } else {
          roots.push(node);
        }
      } else {
        roots.push(node);
      }
    });

    return roots;
  }
}

export default new DepartmentService();
