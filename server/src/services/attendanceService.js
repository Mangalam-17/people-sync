import Attendance from '../models/Attendance.js';
import EmployeeProfile from '../models/EmployeeProfile.js';
import AppError from '../utils/AppError.js';

class AttendanceService {
  /**
   * Check in an employee
   */
  async checkIn(userId, tenantId, checkInData) {
    const { location, ipAddress, device } = checkInData;

    // Find employee
    const employee = await EmployeeProfile.findOne({ userId: userId, tenantId: tenantId });
    if (!employee) {
      throw AppError.notFound('Employee profile not found');
    }

    // Get today's date (start of day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already checked in today
    const existingAttendance = await Attendance.findOne({
      employee: employee._id,
      tenant: tenantId,
      date: today,
    });

    if (existingAttendance) {
      throw AppError.badRequest('Already checked in for today');
    }

    // Create check-in record
    const attendance = await Attendance.create({
      employee: employee._id,
      user: userId,
      tenant: tenantId,
      date: today,
      checkIn: {
        time: new Date(),
        location: location ? {
          type: 'Point',
          coordinates: [location.longitude, location.latitude],
        } : undefined,
        ipAddress,
        device,
      },
      status: 'present',
    });

    // TODO: Check if late based on shift timing
    // For now, consider late if check-in after 9:30 AM
    const checkInTime = attendance.checkIn.time;
    const lateThreshold = new Date(today);
    lateThreshold.setHours(9, 30, 0, 0);

    if (checkInTime > lateThreshold) {
      const lateByMs = checkInTime - lateThreshold;
      const lateByMinutes = Math.floor(lateByMs / (1000 * 60));
      
      attendance.isLate = true;
      attendance.lateBy = lateByMinutes;
      attendance.status = 'late';
      await attendance.save();
    }

    return await attendance.populate('employee user');
  }

  /**
   * Check out an employee
   */
  async checkOut(userId, tenantId, checkOutData) {
    const { location, ipAddress, device } = checkOutData;

    // Find employee
    const employee = await EmployeeProfile.findOne({ userId: userId, tenantId: tenantId });
    if (!employee) {
      throw AppError.notFound('Employee profile not found');
    }

    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find today's attendance
    const attendance = await Attendance.findOne({
      employee: employee._id,
      tenant: tenantId,
      date: today,
    });

    if (!attendance) {
      throw AppError.notFound('No check-in record found for today');
    }

    if (attendance.checkOut && attendance.checkOut.time) {
      throw AppError.badRequest('Already checked out for today');
    }

    // Update check-out
    attendance.checkOut = {
      time: new Date(),
      location: location ? {
        type: 'Point',
        coordinates: [location.longitude, location.latitude],
      } : undefined,
      ipAddress,
      device,
    };

    // Calculate work hours
    attendance.calculateWorkHours();
    
    await attendance.save();

    return await attendance.populate('employee user');
  }

  /**
   * Get attendance status for today
   */
  async getTodayStatus(userId, tenantId) {
    const employee = await EmployeeProfile.findOne({ userId: userId, tenantId: tenantId });
    if (!employee) {
      throw AppError.notFound('Employee profile not found');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      employee: employee._id,
      tenant: tenantId,
      date: today,
    }).populate('employee user');

    return attendance;
  }

  /**
   * Get today's organization attendance summary (for admin dashboard)
   */
  async getTodayOrgSummary(tenantId, date) {
    const today = date || new Date();
    today.setHours(0, 0, 0, 0);

    // Get User model to filter out admins
    const User = (await import('../models/User.js')).default;

    // Get only employee users (roles that mark attendance)
    // Excludes SUPER_ADMIN (tenant owner, not an employee)
    const employeeUsers = await User.find({
      tenantId: tenantId,
      role: { $in: ['admin', 'hr_admin', 'manager', 'employee'] }, // All employee roles
    }).select('_id');

    const employeeUserIds = employeeUsers.map(u => u._id);

    // Get employee profiles for these users
    const employeeProfiles = await EmployeeProfile.find({
      tenantId: tenantId,
      userId: { $in: employeeUserIds },
      status: 'ACTIVE', // Only active employees
    });

    const totalEmployees = employeeProfiles.length;
    const employeeProfileIds = employeeProfiles.map(ep => ep._id);

    // Get today's attendance records for actual employees only
    const todayAttendance = await Attendance.find({
      tenant: tenantId,
      date: today,
      employee: { $in: employeeProfileIds },
    }).populate('employee user');

    const checkedIn = todayAttendance.filter(a => a.checkIn && a.checkIn.time).length;
    const checkedOut = todayAttendance.filter(a => a.checkOut && a.checkOut.time).length;
    const present = todayAttendance.filter(a => ['present', 'late'].includes(a.status)).length;
    const late = todayAttendance.filter(a => a.isLate === true).length;
    const onLeave = todayAttendance.filter(a => a.status === 'on_leave').length;
    const absent = totalEmployees - checkedIn - onLeave;

    const attendancePercentage = totalEmployees > 0 
      ? Math.round((present / totalEmployees) * 100) 
      : 0;

    // Get recent attendance records for display
    const recentAttendance = await Attendance.find({
      tenant: tenantId,
      date: today,
      employee: { $in: employeeProfileIds },
    })
      .populate('employee user')
      .sort({ 'checkIn.time': -1 })
      .limit(10);

    return {
      totalEmployees,
      checkedIn,
      checkedOut,
      present,
      late,
      onLeave,
      absent,
      attendancePercentage,
      date: today,
      recentAttendance,
    };
  }

  /**
   * Get attendance records with filters
   */
  async getAttendanceRecords(tenantId, filters = {}) {
    const {
      employeeId,
      startDate,
      endDate,
      status,
      page = 1,
      limit = 50,
    } = filters;

    const query = { tenant: tenantId };

    if (employeeId) {
      query.employee = employeeId;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const [records, total] = await Promise.all([
      Attendance.find(query)
        .populate('employee user')
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit),
      Attendance.countDocuments(query),
    ]);

    return {
      records,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get attendance summary/statistics
   */
  async getAttendanceSummary(tenantId, filters = {}) {
    const { employeeId, startDate, endDate } = filters;

    const matchStage = { tenant: tenantId };

    if (employeeId) {
      matchStage.employee = employeeId;
    }

    if (startDate || endDate) {
      matchStage.date = {};
      if (startDate) matchStage.date.$gte = new Date(startDate);
      if (endDate) matchStage.date.$lte = new Date(endDate);
    }

    const summary = await Attendance.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalDays: { $sum: 1 },
          presentDays: {
            $sum: { $cond: [{ $in: ['$status', ['present', 'late']] }, 1, 0] },
          },
          absentDays: {
            $sum: { $cond: [{ $eq: ['$status', 'absent'] }, 1, 0] },
          },
          lateDays: {
            $sum: { $cond: [{ $eq: ['$isLate', true] }, 1, 0] },
          },
          onLeaveDays: {
            $sum: { $cond: [{ $eq: ['$status', 'on_leave'] }, 1, 0] },
          },
          totalWorkHours: { $sum: '$workHours' },
          totalOvertimeHours: { $sum: '$overtimeHours' },
          avgWorkHours: { $avg: '$workHours' },
        },
      },
    ]);

    if (summary.length === 0) {
      return {
        totalDays: 0,
        presentDays: 0,
        absentDays: 0,
        lateDays: 0,
        onLeaveDays: 0,
        totalWorkHours: 0,
        totalOvertimeHours: 0,
        avgWorkHours: 0,
        attendancePercentage: 0,
      };
    }

    const data = summary[0];
    data.attendancePercentage = data.totalDays > 0
      ? Math.round((data.presentDays / data.totalDays) * 100)
      : 0;

    delete data._id;
    return data;
  }

  /**
   * Mark employee as absent (admin function)
   */
  async markAbsent(employeeId, tenantId, date, notes) {
    const today = new Date(date);
    today.setHours(0, 0, 0, 0);

    // Check if attendance already exists
    const existing = await Attendance.findOne({
      employee: employeeId,
      tenant: tenantId,
      date: today,
    });

    if (existing) {
      throw AppError.badRequest('Attendance record already exists for this date');
    }

    const employee = await EmployeeProfile.findById(employeeId);
    if (!employee) {
      throw AppError.notFound('Employee not found');
    }

    const attendance = await Attendance.create({
      employee: employeeId,
      user: employee.user,
      tenant: tenantId,
      date: today,
      status: 'absent',
      notes,
    });

    return attendance;
  }

  /**
   * Request regularization
   */
  async requestRegularization(attendanceId, userId, tenantId, reason) {
    const attendance = await Attendance.findOne({
      _id: attendanceId,
      user: userId,
      tenant: tenantId,
    });

    if (!attendance) {
      throw AppError.notFound('Attendance record not found');
    }

    if (attendance.regularizationRequest && attendance.regularizationRequest.requested) {
      throw AppError.badRequest('Regularization already requested');
    }

    attendance.regularizationRequest = {
      requested: true,
      reason,
      status: 'pending',
    };

    await attendance.save();
    return attendance;
  }
}

export default new AttendanceService();
