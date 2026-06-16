import EmployeeProfile from '../models/EmployeeProfile.js';
import Attendance from '../models/Attendance.js';
import Leave from '../models/Leave.js';
import Department from '../models/Department.js';
import User from '../models/User.js';
import { startOfMonth, endOfMonth, subMonths, startOfWeek, endOfWeek } from 'date-fns';

class AnalyticsService {
  /**
   * Get comprehensive dashboard analytics
   */
  async getDashboardAnalytics(tenantId, userId, userRole) {
    const now = new Date();
    const startOfCurrentMonth = startOfMonth(now);
    const endOfCurrentMonth = endOfMonth(now);
    const startOfLastMonth = startOfMonth(subMonths(now, 1));
    const endOfLastMonth = endOfMonth(subMonths(now, 1));

    // Base query for tenant
    const tenantQuery = { tenantId };

    // Get total employee count
    const totalEmployees = await EmployeeProfile.countDocuments({
      ...tenantQuery,
      status: 'ACTIVE',
    });

    // Get previous month employee count for growth calculation
    const previousMonthEmployees = await EmployeeProfile.countDocuments({
      ...tenantQuery,
      status: 'ACTIVE',
      createdAt: { $lte: endOfLastMonth },
    });

    // Calculate headcount growth
    const headcountGrowth = previousMonthEmployees > 0
      ? (((totalEmployees - previousMonthEmployees) / previousMonthEmployees) * 100).toFixed(1)
      : 0;

    // Get today's attendance stats
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const todayEnd = new Date(now.setHours(23, 59, 59, 999));

    const todayAttendance = await Attendance.countDocuments({
      tenantId,
      date: { $gte: todayStart, $lte: todayEnd },
      status: { $in: ['present', 'late'] },
    });

    const todayAttendancePercentage = totalEmployees > 0
      ? ((todayAttendance / totalEmployees) * 100).toFixed(1)
      : 0;

    // Get pending leave requests
    const pendingLeaves = await Leave.countDocuments({
      tenantId,
      status: 'PENDING',
    });

    // Get active employees by department
    const departmentBreakdown = await EmployeeProfile.aggregate([
      {
        $match: {
          tenantId,
          status: 'ACTIVE',
        },
      },
      {
        $lookup: {
          from: 'departments',
          localField: 'departmentId',
          foreignField: '_id',
          as: 'department',
        },
      },
      { $unwind: { path: '$department', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$department.name',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Get attendance trend for last 7 days
    const attendanceTrend = await this.getAttendanceTrend(tenantId, 7);

    // Get leave statistics
    const leaveStats = await this.getLeaveStatistics(tenantId);

    // Get late arrival trends
    const lateArrivals = await Attendance.countDocuments({
      tenantId,
      date: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth },
      status: 'late',
    });

    return {
      overview: {
        totalEmployees,
        headcountGrowth: parseFloat(headcountGrowth),
        todayAttendance,
        todayAttendancePercentage: parseFloat(todayAttendancePercentage),
        pendingLeaves,
        lateArrivals,
      },
      departmentBreakdown: departmentBreakdown.map(dept => ({
        name: dept._id || 'Unassigned',
        count: dept.count,
      })),
      attendanceTrend,
      leaveStats,
    };
  }

  /**
   * Get attendance trend for specified number of days
   */
  async getAttendanceTrend(tenantId, days = 7) {
    const trends = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));

      const presentCount = await Attendance.countDocuments({
        tenantId,
        date: { $gte: dayStart, $lte: dayEnd },
        status: { $in: ['present', 'late'] },
      });

      const totalEmployees = await EmployeeProfile.countDocuments({
        tenantId,
        status: 'ACTIVE',
        joiningDate: { $lte: dayEnd },
      });

      const percentage = totalEmployees > 0
        ? ((presentCount / totalEmployees) * 100).toFixed(1)
        : 0;

      trends.push({
        date: dayStart.toISOString().split('T')[0],
        present: presentCount,
        total: totalEmployees,
        percentage: parseFloat(percentage),
      });
    }

    return trends;
  }

  /**
   * Get leave statistics
   */
  async getLeaveStatistics(tenantId) {
    const now = new Date();
    const startOfCurrentMonth = startOfMonth(now);
    const endOfCurrentMonth = endOfMonth(now);

    // Leave type breakdown
    const leaveTypeBreakdown = await Leave.aggregate([
      {
        $match: {
          tenantId,
          status: { $in: ['APPROVED', 'PENDING'] },
          startDate: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth },
        },
      },
      {
        $group: {
          _id: '$leaveType',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Leave status breakdown
    const leaveStatusBreakdown = await Leave.aggregate([
      {
        $match: {
          tenantId,
          startDate: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth },
        },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    return {
      byType: leaveTypeBreakdown.map(leave => ({
        type: leave._id,
        count: leave.count,
      })),
      byStatus: leaveStatusBreakdown.map(leave => ({
        status: leave._id,
        count: leave.count,
      })),
    };
  }

  /**
   * Get monthly attendance report
   */
  async getMonthlyAttendanceReport(tenantId, month, year) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = endOfMonth(startDate);

    const attendanceData = await Attendance.aggregate([
      {
        $match: {
          tenantId,
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $lookup: {
          from: 'employeeprofiles',
          localField: 'employeeId',
          foreignField: '_id',
          as: 'employee',
        },
      },
      { $unwind: '$employee' },
      {
        $group: {
          _id: '$userId',
          firstName: { $first: '$user.firstName' },
          lastName: { $first: '$user.lastName' },
          email: { $first: '$user.email' },
          presentDays: {
            $sum: { $cond: [{ $in: ['$status', ['present', 'late']] }, 1, 0] },
          },
          lateDays: {
            $sum: { $cond: [{ $eq: ['$status', 'late'] }, 1, 0] },
          },
          absentDays: {
            $sum: { $cond: [{ $eq: ['$status', 'absent'] }, 1, 0] },
          },
          totalWorkHours: { $sum: '$workHours' },
        },
      },
      { $sort: { firstName: 1, lastName: 1 } },
    ]);

    return attendanceData;
  }

  /**
   * Get department-wise analytics
   */
  async getDepartmentAnalytics(tenantId) {
    const departments = await Department.find({ tenantId }).lean();

    const analytics = await Promise.all(
      departments.map(async (dept) => {
        const employeeCount = await EmployeeProfile.countDocuments({
          tenantId,
          departmentId: dept._id,
          status: 'ACTIVE',
        });

        // Get current month attendance for this department
        const now = new Date();
        const startOfCurrentMonth = startOfMonth(now);
        const endOfCurrentMonth = endOfMonth(now);

        const employees = await EmployeeProfile.find({
          tenantId,
          departmentId: dept._id,
          status: 'ACTIVE',
        }).select('userId');

        const userIds = employees.map(emp => emp.userId);

        const attendanceStats = await Attendance.aggregate([
          {
            $match: {
              tenantId,
              userId: { $in: userIds },
              date: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth },
            },
          },
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 },
            },
          },
        ]);

        const presentCount = attendanceStats.find(s => s._id === 'present')?.count || 0;
        const lateCount = attendanceStats.find(s => s._id === 'late')?.count || 0;
        const totalAttendance = presentCount + lateCount;

        const workingDays = Math.floor((now - startOfCurrentMonth) / (1000 * 60 * 60 * 24)) + 1;
        const expectedAttendance = employeeCount * workingDays;
        const attendancePercentage = expectedAttendance > 0
          ? ((totalAttendance / expectedAttendance) * 100).toFixed(1)
          : 0;

        return {
          departmentName: dept.name,
          employeeCount,
          attendancePercentage: parseFloat(attendancePercentage),
          presentDays: totalAttendance,
          lateDays: lateCount,
        };
      })
    );

    return analytics;
  }

  /**
   * Get employee growth trend (last 6 months)
   */
  async getEmployeeGrowthTrend(tenantId) {
    const trends = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(now, i);
      const monthEnd = endOfMonth(monthDate);

      const count = await EmployeeProfile.countDocuments({
        tenantId,
        status: 'ACTIVE',
        joiningDate: { $lte: monthEnd },
      });

      trends.push({
        month: monthDate.toLocaleString('default', { month: 'short', year: 'numeric' }),
        count,
      });
    }

    return trends;
  }

  /**
   * Get personal employee analytics
   */
  async getPersonalAnalytics(tenantId, userId) {
    const now = new Date();
    const startOfCurrentMonth = startOfMonth(now);
    const endOfCurrentMonth = endOfMonth(now);

    // Get employee profile
    const employee = await EmployeeProfile.findOne({ tenantId, userId }).lean();
    if (!employee) {
      throw new Error('Employee profile not found');
    }

    // Current month attendance
    const attendanceSummary = await Attendance.aggregate([
      {
        $match: {
          tenantId,
          userId,
          date: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth },
        },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalWorkHours: { $sum: '$workHours' },
        },
      },
    ]);

    const presentDays = attendanceSummary.find(s => s._id === 'present')?.count || 0;
    const lateDays = attendanceSummary.find(s => s._id === 'late')?.count || 0;
    const absentDays = attendanceSummary.find(s => s._id === 'absent')?.count || 0;
    const totalWorkHours = attendanceSummary.reduce((sum, s) => sum + (s.totalWorkHours || 0), 0);

    const workingDays = Math.floor((now - startOfCurrentMonth) / (1000 * 60 * 60 * 24)) + 1;
    const attendancePercentage = workingDays > 0
      ? (((presentDays + lateDays) / workingDays) * 100).toFixed(1)
      : 0;

    // Leave balance
    const leaveBalance = await Leave.aggregate([
      {
        $match: {
          tenantId,
          employeeId: employee._id,
          status: 'APPROVED',
        },
      },
      {
        $group: {
          _id: '$leaveType',
          daysUsed: { $sum: '$numberOfDays' },
        },
      },
    ]);

    return {
      attendance: {
        presentDays,
        lateDays,
        absentDays,
        attendancePercentage: parseFloat(attendancePercentage),
        totalWorkHours: Math.round(totalWorkHours),
        avgWorkHoursPerDay: presentDays + lateDays > 0
          ? (totalWorkHours / (presentDays + lateDays)).toFixed(1)
          : 0,
      },
      leaveBalance: leaveBalance.map(leave => ({
        type: leave._id,
        used: leave.daysUsed,
      })),
    };
  }
}

export default new AnalyticsService();
