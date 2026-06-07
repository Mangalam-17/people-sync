import Team from '../models/Team.js';

class TeamRepository {
  async create(data) {
    return Team.create(data);
  }

  async findById(id) {
    return Team.findById(id)
      .populate('departmentId', 'name code')
      .populate('leadId', 'firstName lastName email avatar');
  }

  async findByTenant(tenantId, { page = 1, limit = 50, search, isActive, departmentId } = {}) {
    const filter = { tenantId };

    if (typeof isActive === 'boolean') filter.isActive = isActive;
    if (departmentId) filter.departmentId = departmentId;
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const skip = (page - 1) * limit;
    const [teams, total] = await Promise.all([
      Team.find(filter)
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit)
        .populate('departmentId', 'name code')
        .populate('leadId', 'firstName lastName email avatar'),
      Team.countDocuments(filter),
    ]);

    return { teams, total, page, limit };
  }

  async findAllByTenant(tenantId, isActive = true) {
    return Team.find({ tenantId, isActive })
      .sort({ name: 1 })
      .populate('departmentId', 'name code')
      .populate('leadId', 'firstName lastName email avatar');
  }

  async findByDepartment(tenantId, departmentId) {
    return Team.find({ tenantId, departmentId, isActive: true })
      .sort({ name: 1 })
      .populate('leadId', 'firstName lastName email avatar');
  }

  async update(id, data) {
    return Team.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate('departmentId', 'name code')
      .populate('leadId', 'firstName lastName email avatar');
  }

  async delete(id) {
    return Team.findByIdAndDelete(id);
  }

  async nameExistsInDepartment(tenantId, departmentId, name, excludeId = null) {
    const filter = { tenantId, departmentId, name: { $regex: new RegExp(`^${name}$`, 'i') } };
    if (excludeId) filter._id = { $ne: excludeId };
    const count = await Team.countDocuments(filter);
    return count > 0;
  }

  async countByDepartment(departmentId) {
    return Team.countDocuments({ departmentId, isActive: true });
  }

  async countByTenant(tenantId) {
    return Team.countDocuments({ tenantId, isActive: true });
  }
}

export default new TeamRepository();
