import mongoose from 'mongoose';

const leaveBalanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EmployeeProfile',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant',
      required: true,
      index: true,
    },
    year: {
      type: Number,
      required: true,
      default: () => new Date().getFullYear(),
    },
    leaveTypes: {
      sick: {
        total: { type: Number, default: 12 },
        used: { type: Number, default: 0 },
        pending: { type: Number, default: 0 },
      },
      casual: {
        total: { type: Number, default: 12 },
        used: { type: Number, default: 0 },
        pending: { type: Number, default: 0 },
      },
      earned: {
        total: { type: Number, default: 15 },
        used: { type: Number, default: 0 },
        pending: { type: Number, default: 0 },
      },
      unpaid: {
        total: { type: Number, default: 0 }, // Unlimited
        used: { type: Number, default: 0 },
        pending: { type: Number, default: 0 },
      },
      maternity: {
        total: { type: Number, default: 180 },
        used: { type: Number, default: 0 },
        pending: { type: Number, default: 0 },
      },
      paternity: {
        total: { type: Number, default: 15 },
        used: { type: Number, default: 0 },
        pending: { type: Number, default: 0 },
      },
      bereavement: {
        total: { type: Number, default: 5 },
        used: { type: Number, default: 0 },
        pending: { type: Number, default: 0 },
      },
      compensatory: {
        total: { type: Number, default: 0 },
        used: { type: Number, default: 0 },
        pending: { type: Number, default: 0 },
      },
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index
leaveBalanceSchema.index({ employee: 1, year: 1, tenant: 1 }, { unique: true });

// Method to get available balance for a leave type
leaveBalanceSchema.methods.getAvailable = function (leaveType) {
  const typeData = this.leaveTypes[leaveType];
  if (!typeData) return 0;
  
  // For unpaid leaves, return unlimited (represented as -1)
  if (leaveType === 'unpaid') return -1;
  
  return typeData.total - typeData.used - typeData.pending;
};

// Method to update balance
leaveBalanceSchema.methods.updateBalance = function (leaveType, days, status) {
  if (!this.leaveTypes[leaveType]) return;
  
  if (status === 'pending') {
    this.leaveTypes[leaveType].pending += days;
  } else if (status === 'approved') {
    this.leaveTypes[leaveType].pending -= days;
    this.leaveTypes[leaveType].used += days;
  } else if (status === 'rejected' || status === 'cancelled') {
    this.leaveTypes[leaveType].pending -= days;
  }
};

const LeaveBalance = mongoose.model('LeaveBalance', leaveBalanceSchema);

export default LeaveBalance;
