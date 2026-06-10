import mongoose from 'mongoose';

const emergencyContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  relationship: { type: String, required: true },
  phone: { type: String, required: true },
});

const employeeProfileSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant',
      required: [true, 'Tenant ID is required'],
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      unique: true,
      index: true,
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      default: null,
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      default: null,
    },
    designationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Designation',
      default: null,
    },
    employmentType: {
      type: String,
      enum: ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN'],
      default: 'FULL_TIME',
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'ON_LEAVE', 'TERMINATED', 'RESIGNED'],
      default: 'ACTIVE',
    },
    joiningDate: {
      type: Date,
      required: [true, 'Joining date is required'],
    },
    baseSalary: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    emergencyContact: {
      type: emergencyContactSchema,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast querying
employeeProfileSchema.index({ tenantId: 1, departmentId: 1 });
employeeProfileSchema.index({ tenantId: 1, status: 1 });

const EmployeeProfile = mongoose.model('EmployeeProfile', employeeProfileSchema);

export default EmployeeProfile;
