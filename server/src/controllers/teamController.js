import teamService from '../services/teamService.js';
import { successResponse, createdResponse, paginatedResponse } from '../utils/responseFormatter.js';

class TeamController {
  async list(req, res, next) {
    try {
      const { teams, total, page, limit } = await teamService.list(req.user.tenantId, req.query);
      return paginatedResponse(res, teams, { page, limit, total });
    } catch (error) { next(error); }
  }

  async listAll(req, res, next) {
    try {
      const teams = await teamService.listAll(req.user.tenantId);
      return successResponse(res, teams);
    } catch (error) { next(error); }
  }

  async getById(req, res, next) {
    try {
      const team = await teamService.getById(req.user.tenantId, req.params.id);
      return successResponse(res, team);
    } catch (error) { next(error); }
  }

  async getByDepartment(req, res, next) {
    try {
      const teams = await teamService.getByDepartment(req.user.tenantId, req.params.departmentId);
      return successResponse(res, teams);
    } catch (error) { next(error); }
  }

  async create(req, res, next) {
    try {
      const team = await teamService.create(
        req.user.tenantId, req.body, req.user,
        { ipAddress: req.ip, userAgent: req.get('User-Agent') }
      );
      return createdResponse(res, team, 'Team created successfully');
    } catch (error) { next(error); }
  }

  async update(req, res, next) {
    try {
      const team = await teamService.update(
        req.user.tenantId, req.params.id, req.body, req.user,
        { ipAddress: req.ip, userAgent: req.get('User-Agent') }
      );
      return successResponse(res, team, 'Team updated successfully');
    } catch (error) { next(error); }
  }

  async delete(req, res, next) {
    try {
      const result = await teamService.delete(
        req.user.tenantId, req.params.id, req.user,
        { ipAddress: req.ip, userAgent: req.get('User-Agent') }
      );
      return successResponse(res, null, result.message);
    } catch (error) { next(error); }
  }
}

export default new TeamController();
