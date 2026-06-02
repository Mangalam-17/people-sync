import Tenant from '../models/Tenant.js';

class TenantRepository {
  async create(data) {
    return Tenant.create(data);
  }

  async findById(id) {
    return Tenant.findById(id);
  }

  async findBySlug(slug) {
    return Tenant.findOne({ slug });
  }

  async findByDomain(domain) {
    return Tenant.findOne({ domain, isActive: true });
  }

  async update(id, data) {
    return Tenant.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async slugExists(slug) {
    const count = await Tenant.countDocuments({ slug });
    return count > 0;
  }

  /**
   * Generate a unique slug from company name.
   * Appends a number suffix if the slug already exists.
   */
  async generateUniqueSlug(name) {
    let slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    let uniqueSlug = slug;
    let counter = 1;

    while (await this.slugExists(uniqueSlug)) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    return uniqueSlug;
  }
}

export default new TenantRepository();
