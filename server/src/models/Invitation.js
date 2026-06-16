import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const invitationSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    plan: {
      type: String,
      enum: ['free', 'pro', 'enterprise'],
      default: 'free',
    },
    maxUsers: {
      type: Number,
      default: null, // null = unlimited
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    isUsed: {
      type: Boolean,
      default: false,
      index: true,
    },
    usedAt: {
      type: Date,
      default: null,
    },
    usedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant',
      default: null,
    },
    createdBy: {
      type: String,
      default: 'system',
    },
    notes: {
      type: String,
      trim: true,
    },
    metadata: {
      type: Map,
      of: String,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for checking if expired
invitationSchema.virtual('isExpired').get(function () {
  return this.expiresAt < new Date();
});

// Virtual for checking if valid (not used and not expired)
invitationSchema.virtual('isValid').get(function () {
  return !this.isUsed && !this.isExpired;
});

// Generate a random invitation code
invitationSchema.statics.generateCode = function () {
  // Format: INV-XXXXX-XXXXX (e.g., INV-A3B2C-D4E5F)
  const part1 = uuidv4().substring(0, 5).toUpperCase();
  const part2 = uuidv4().substring(0, 5).toUpperCase();
  return `INV-${part1}-${part2}`;
};

// Mark invitation as used
invitationSchema.methods.markAsUsed = function (userId, tenantId) {
  this.isUsed = true;
  this.usedAt = new Date();
  this.usedBy = userId;
  this.tenantId = tenantId;
  return this.save();
};

// Index for efficient queries
invitationSchema.index({ code: 1, isUsed: 1, expiresAt: 1 });

// Ensure virtuals are included in JSON
invitationSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const Invitation = mongoose.model('Invitation', invitationSchema);

export default Invitation;
