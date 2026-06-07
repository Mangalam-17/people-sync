import Designation from '../models/Designation.js';

class DesignationRepository {
  async create(data) {
    return Designation.create(data);
  }

  async findById(id) {
    return Designation.findById(id);
  }

  async findByTenant(tenantId, { page = 1, limit = 50, search, isActive } = {}) {
    const filter = { tenantId };

    if (typeof isActive === 'boolean') filter.isActive = isActive;
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    const skip = (page - 1) * limit;
    const [designations, total] = await Promise.all([
      Designation.find(filter).sort({ level: 1, title: 1 }).skip(skip).limit(limit),
      Designation.countDocuments(filter),
    ]);

    return { designations, total, page, limit };
  }

  async findAllByTenant(tenantId, isActive = true) {
    return Designation.find({ tenantId, isActive }).sort({ level: 1, title: 1 });
  }

  async update(id, data) {
    return Designation.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id) {
    return Designation.findByIdAndDelete(id);
  }

  async titleExistsInTenant(tenantId, title, excludeId = null) {
    const filter = { tenantId, title: { $regex: new RegExp(`^${title}$`, 'i') } };
    if (excludeId) filter._id = { $ne: excludeId };
    const count = await Designation.countDocuments(filter);
    return count > 0;
  }

  async countByTenant(tenantId) {
    return Designation.countDocuments({ tenantId, isActive: true });
  }
}

export default new DesignationRepository();
