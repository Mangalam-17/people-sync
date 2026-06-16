import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
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
    date: {
      type: Date,
      required: true,
      index: true,
    },
    checkIn: {
      time: {
        type: Date,
        required: true,
      },
      location: {
        type: {
          type: String,
          enum: ['Point'],
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
        },
      },
      ipAddress: String,
      device: String,
    },
    checkOut: {
      time: Date,
      location: {
        type: {
          type: String,
          enum: ['Point'],
        },
        coordinates: {
          type: [Number],
        },
      },
      ipAddress: String,
      device: String,
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'late', 'half_day', 'on_leave'],
      default: 'present',
    },
    workHours: {
      type: Number,
      default: 0, // in hours
    },
    breakHours: {
      type: Number,
      default: 0,
    },
    overtimeHours: {
      type: Number,
      default: 0,
    },
    isLate: {
      type: Boolean,
      default: false,
    },
    lateBy: {
      type: Number, // in minutes
      default: 0,
    },
    notes: String,
    regularizationRequest: {
      requested: {
        type: Boolean,
        default: false,
      },
      reason: String,
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
      },
      approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      approvedAt: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for unique attendance per employee per day
attendanceSchema.index({ employee: 1, date: 1, tenant: 1 }, { unique: true });

// Index for geospatial queries
attendanceSchema.index({ 'checkIn.location': '2dsphere' });
attendanceSchema.index({ 'checkOut.location': '2dsphere' });

// Virtual for total hours worked
attendanceSchema.virtual('totalHours').get(function () {
  if (this.checkOut && this.checkOut.time && this.checkIn && this.checkIn.time) {
    const diff = this.checkOut.time - this.checkIn.time;
    return Math.round((diff / (1000 * 60 * 60)) * 100) / 100; // hours with 2 decimal places
  }
  return 0;
});

// Method to calculate work hours
attendanceSchema.methods.calculateWorkHours = function () {
  if (this.checkOut && this.checkOut.time && this.checkIn && this.checkIn.time) {
    const totalMs = this.checkOut.time - this.checkIn.time;
    const totalHours = totalMs / (1000 * 60 * 60);
    this.workHours = Math.max(0, totalHours - this.breakHours);
    
    // Calculate overtime (assuming 8 hours is standard)
    if (this.workHours > 8) {
      this.overtimeHours = this.workHours - 8;
    }
  }
};

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;
