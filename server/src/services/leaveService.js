import Leave from '../models/Leave.js';
import LeaveBalance from '../models/LeaveBalance.js';
import EmployeeProfile from '../models/EmployeeProfile.js';
import AppError from '../utils/AppError.js';

class LeaveService {
  /**
   * Apply for leave
   */
  async applyLeave(userId, tenantId, leaveData) {
    const {
      leaveType,
      startDate,
      endDate,
      isHalfDay,
      halfDaySession,
      reason,
      contactDuringLeave,
    } = leaveData;

    // Find employee
    const employee = await EmployeeProfile.findOne({ userId: userId, tenantId: tenantId });
    if (!employee) {
      throw AppError.notFound('Employee profile not found');
    }

    // Get leave balance for current year
    const year = new Date().getFullYear();
    let leaveBalance = await LeaveBalance.findOne({
      employee: employee._id,
      year,
      tenant: tenantId,
    });

    // Create leave balance if doesn't exist
    if (!leaveBalance) {
      leaveBalance = await LeaveBalance.create({
        employee: employee._id,
        user: userId,
        tenant: tenantId,
        year,
      });
    }

    // Calculate number of days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const numberOfDays = isHalfDay ? 0.5 : Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    // Check if enough leave balance available (except for unpaid)
    if (leaveType !== 'unpaid') {
      const available = leaveBalance.getAvailable(leaveType);
      if (available < numberOfDays) {
        throw AppError.badRequest(
          `Insufficient ${leaveType} leave balance. Available: ${available} days`
        );
      }
    }

    // Check for overlapping leaves
    const overlapping = await Leave.findOne({
      employee: employee._id,
      tenant: tenantId,
      status: { $in: ['pending', 'approved'] },
      $or: [
        { startDate: { $lte: end }, endDate: { $gte: start } },
      ],
    });

    if (overlapping) {
      throw AppError.badRequest('Leave request overlaps with existing leave');
    }

    // Create leave request
    const leave = await Leave.create({
      employee: employee._id,
      user: userId,
      tenant: tenantId,
      leaveType,
      startDate: start,
      endDate: end,
      numberOfDays,
      isHalfDay,
      halfDaySession,
      reason,
      contactDuringLeave,
      status: 'pending',
    });

    // Update pending balance
    leaveBalance.updateBalance(leaveType, numberOfDays, 'pending');
    await leaveBalance.save();

    return await leave.populate('employee user');
  }

  /**
   * Get leave requests with filters
   */
  async getLeaveRequests(tenantId, filters = {}) {
    const {
      employeeId,
      status,
      leaveType,
      startDate,
      endDate,
      page = 1,
      limit = 50,
    } = filters;

    const query = { tenant: tenantId };

    if (employeeId) {
      query.employee = employeeId;
    }

    if (status) {
      query.status = status;
    }

    if (leaveType) {
      query.leaveType = leaveType;
    }

    if (startDate || endDate) {
      query.startDate = {};
      if (startDate) {
        query.startDate.$gte = new Date(startDate);
      }
      if (endDate) {
        query.startDate.$lte = new Date(endDate);
      }
    }

    const skip = (page - 1) * limit;

    const [requests, total] = await Promise.all([
      Leave.find(query)
        .populate('employee user reviewedBy')
        .sort({ appliedDate: -1 })
        .skip(skip)
        .limit(limit),
      Leave.countDocuments(query),
    ]);

    return {
      requests,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get pending leaves for approval (for managers/HR)
   */
  async getPendingLeaves(tenantId, filters = {}) {
    const { page = 1, limit = 50 } = filters;
    
    const query = {
      tenant: tenantId,
      status: 'pending',
    };

    const skip = (page - 1) * limit;

    const [requests, total] = await Promise.all([
      Leave.find(query)
        .populate('employee user')
        .sort({ appliedDate: 1 }) // Oldest first
        .skip(skip)
        .limit(limit),
      Leave.countDocuments(query),
    ]);

    return {
      requests,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Approve or reject leave
   */
  async reviewLeave(leaveId, tenantId, reviewerId, decision, reviewNotes) {
    const leave = await Leave.findOne({ _id: leaveId, tenant: tenantId });

    if (!leave) {
      throw AppError.notFound('Leave request not found');
    }

    if (leave.status !== 'pending') {
      throw AppError.badRequest('Leave request already reviewed');
    }

    leave.status = decision; // 'approved' or 'rejected'
    leave.reviewedBy = reviewerId;
    leave.reviewedAt = new Date();
    leave.reviewNotes = reviewNotes;

    await leave.save();

    // Update leave balance
    const year = new Date(leave.startDate).getFullYear();
    const leaveBalance = await LeaveBalance.findOne({
      employee: leave.employee,
      year,
      tenant: tenantId,
    });

    if (leaveBalance) {
      leaveBalance.updateBalance(leave.leaveType, leave.numberOfDays, decision);
      await leaveBalance.save();
    }

    return await leave.populate('employee user reviewedBy');
  }

  /**
   * Cancel leave request
   */
  async cancelLeave(leaveId, userId, tenantId) {
    const leave = await Leave.findOne({
      _id: leaveId,
      user: userId,
      tenant: tenantId,
    });

    if (!leave) {
      throw AppError.notFound('Leave request not found');
    }

    if (leave.status === 'cancelled') {
      throw AppError.badRequest('Leave already cancelled');
    }

    if (leave.status === 'approved') {
      // Check if leave has already started
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (new Date(leave.startDate) <= today) {
        throw AppError.badRequest('Cannot cancel leave that has already started');
      }
    }

    const oldStatus = leave.status;
    leave.status = 'cancelled';
    await leave.save();

    // Update leave balance
    const year = new Date(leave.startDate).getFullYear();
    const leaveBalance = await LeaveBalance.findOne({
      employee: leave.employee,
      year,
      tenant: tenantId,
    });

    if (leaveBalance) {
      leaveBalance.updateBalance(leave.leaveType, leave.numberOfDays, 'cancelled');
      await leaveBalance.save();
    }

    return leave;
  }

  /**
   * Get leave balance
   */
  async getLeaveBalance(userId, tenantId, year) {
    const employee = await EmployeeProfile.findOne({ userId: userId, tenantId: tenantId });
    if (!employee) {
      throw AppError.notFound('Employee profile not found');
    }

    const currentYear = year || new Date().getFullYear();

    let leaveBalance = await LeaveBalance.findOne({
      employee: employee._id,
      year: currentYear,
      tenant: tenantId,
    });

    // Create if doesn't exist
    if (!leaveBalance) {
      leaveBalance = await LeaveBalance.create({
        employee: employee._id,
        user: userId,
        tenant: tenantId,
        year: currentYear,
      });
    }

    return leaveBalance;
  }

  /**
   * Get leave balance for specific employee (admin)
   */
  async getEmployeeLeaveBalance(employeeId, tenantId, year) {
    const currentYear = year || new Date().getFullYear();

    let leaveBalance = await LeaveBalance.findOne({
      employee: employeeId,
      year: currentYear,
      tenant: tenantId,
    }).populate('employee user');

    if (!leaveBalance) {
      const employee = await EmployeeProfile.findById(employeeId);
      if (!employee) {
        throw AppError.notFound('Employee not found');
      }

      leaveBalance = await LeaveBalance.create({
        employee: employeeId,
        userId: employee.userId,
        tenant: tenantId,
        year: currentYear,
      });
      
      leaveBalance = await leaveBalance.populate('employee user');
    }

    return leaveBalance;
  }
}

export default new LeaveService();
