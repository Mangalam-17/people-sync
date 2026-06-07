import departmentService from '../services/departmentService.js';
import { successResponse, createdResponse, paginatedResponse } from '../utils/responseFormatter.js';

class DepartmentController {
  async list(req, res, next) {
    try {
      const { departments, total, page, limit } = await departmentService.list(req.user.tenantId, req.query);
      return paginatedResponse(res, departments, { page, limit, total });
    } catch (error) { next(error); }
  }

  async listAll(req, res, next) {
    try {
      const departments = await departmentService.listAll(req.user.tenantId);
      return successResponse(res, departments);
    } catch (error) { next(error); }
  }

  async getById(req, res, next) {
    try {
      const department = await departmentService.getById(req.user.tenantId, req.params.id);
      return successResponse(res, department);
    } catch (error) { next(error); }
  }

  async create(req, res, next) {
    try {
      const department = await departmentService.create(
        req.user.tenantId, req.body, req.user,
        { ipAddress: req.ip, userAgent: req.get('User-Agent') }
      );
      return createdResponse(res, department, 'Department created successfully');
    } catch (error) { next(error); }
  }

  async update(req, res, next) {
    try {
      const department = await departmentService.update(
        req.user.tenantId, req.params.id, req.body, req.user,
        { ipAddress: req.ip, userAgent: req.get('User-Agent') }
      );
      return successResponse(res, department, 'Department updated successfully');
    } catch (error) { next(error); }
  }

  async delete(req, res, next) {
    try {
      const result = await departmentService.delete(
        req.user.tenantId, req.params.id, req.user,
        { ipAddress: req.ip, userAgent: req.get('User-Agent') }
      );
      return successResponse(res, null, result.message);
    } catch (error) { next(error); }
  }

  async orgChart(req, res, next) {
    try {
      const chart = await departmentService.getOrgChart(req.user.tenantId);
      return successResponse(res, chart);
    } catch (error) { next(error); }
  }
}

export default new DepartmentController();
