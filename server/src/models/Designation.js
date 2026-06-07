import mongoose from 'mongoose';

const designationSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant',
      required: [true, 'Tenant ID is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Designation title is required'],
      trim: true,
      maxlength: [100, 'Designation title cannot exceed 100 characters'],
    },
    level: {
      type: Number,
      default: 0,
      min: [0, 'Level cannot be negative'],
      max: [20, 'Level cannot exceed 20'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound unique: title unique within a tenant
designationSchema.index({ tenantId: 1, title: 1 }, { unique: true });
designationSchema.index({ tenantId: 1, isActive: 1 });
designationSchema.index({ tenantId: 1, level: 1 });

const Designation = mongoose.model('Designation', designationSchema);

export default Designation;
