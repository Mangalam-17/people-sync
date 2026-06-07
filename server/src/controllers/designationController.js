import designationService from '../services/designationService.js';
import { successResponse, createdResponse, paginatedResponse } from '../utils/responseFormatter.js';

class DesignationController {
  async list(req, res, next) {
    try {
      const { designations, total, page, limit } = await designationService.list(req.user.tenantId, req.query);
      return paginatedResponse(res, designations, { page, limit, total });
    } catch (error) { next(error); }
  }

  async listAll(req, res, next) {
    try {
      const designations = await designationService.listAll(req.user.tenantId);
      return successResponse(res, designations);
    } catch (error) { next(error); }
  }

  async getById(req, res, next) {
    try {
      const designation = await designationService.getById(req.user.tenantId, req.params.id);
      return successResponse(res, designation);
    } catch (error) { next(error); }
  }

  async create(req, res, next) {
    try {
      const designation = await designationService.create(
        req.user.tenantId, req.body, req.user,
        { ipAddress: req.ip, userAgent: req.get('User-Agent') }
      );
      return createdResponse(res, designation, 'Designation created successfully');
    } catch (error) { next(error); }
  }

  async update(req, res, next) {
    try {
      const designation = await designationService.update(
        req.user.tenantId, req.params.id, req.body, req.user,
        { ipAddress: req.ip, userAgent: req.get('User-Agent') }
      );
      return successResponse(res, designation, 'Designation updated successfully');
    } catch (error) { next(error); }
  }

  async delete(req, res, next) {
    try {
      const result = await designationService.delete(
        req.user.tenantId, req.params.id, req.user,
        { ipAddress: req.ip, userAgent: req.get('User-Agent') }
      );
      return successResponse(res, null, result.message);
    } catch (error) { next(error); }
  }
}

export default new DesignationController();
