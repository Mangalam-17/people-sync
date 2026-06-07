import Department from '../models/Department.js';

class DepartmentRepository {
  async create(data) {
    return Department.create(data);
  }

  async findById(id) {
    return Department.findById(id).populate('headId', 'firstName lastName email avatar');
  }

  async findByTenant(tenantId, { page = 1, limit = 50, search, isActive, parentId } = {}) {
    const filter = { tenantId };

    if (typeof isActive === 'boolean') filter.isActive = isActive;
    if (parentId !== undefined) filter.parentId = parentId;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const [departments, total] = await Promise.all([
      Department.find(filter)
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit)
        .populate('headId', 'firstName lastName email avatar'),
      Department.countDocuments(filter),
    ]);

    return { departments, total, page, limit };
  }

  async findAllByTenant(tenantId, isActive = true) {
    return Department.find({ tenantId, isActive })
      .sort({ name: 1 })
      .populate('headId', 'firstName lastName email avatar');
  }

  async update(id, data) {
    return Department.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate('headId', 'firstName lastName email avatar');
  }

  async delete(id) {
    return Department.findByIdAndDelete(id);
  }

  async nameExistsInTenant(tenantId, name, excludeId = null) {
    const filter = { tenantId, name: { $regex: new RegExp(`^${name}$`, 'i') } };
    if (excludeId) filter._id = { $ne: excludeId };
    const count = await Department.countDocuments(filter);
    return count > 0;
  }

  async codeExistsInTenant(tenantId, code, excludeId = null) {
    if (!code) return false;
    const filter = { tenantId, code: code.toUpperCase() };
    if (excludeId) filter._id = { $ne: excludeId };
    const count = await Department.countDocuments(filter);
    return count > 0;
  }

  async countByTenant(tenantId) {
    return Department.countDocuments({ tenantId, isActive: true });
  }

  async getHierarchy(tenantId) {
    return Department.find({ tenantId, isActive: true })
      .sort({ name: 1 })
      .populate('headId', 'firstName lastName email avatar')
      .lean();
  }
}

export default new DepartmentRepository();
