import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  Calendar,
  LogIn,
  LogOut,
  TrendingUp,
  AlertCircle,
  Users,
  Eye,
  User,
} from 'lucide-react';
import {
  useCheckInMutation,
  useCheckOutMutation,
  useGetTodayStatusQuery,
  useGetAttendanceSummaryQuery,
  useGetTodayOrgSummaryQuery,
  useGetAttendanceRecordsQuery,
} from '@/features/attendance/attendanceApi';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

const AttendancePage = () => {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'super_admin';
  
  // If Super Admin, show organization view instead
  if (isSuperAdmin) {
    return <SuperAdminAttendanceView />;
  }
  
  // Regular employee/admin/manager attendance page
  return <EmployeeAttendanceView />;
};

// Super Admin View - View-only, no check-in/check-out
const SuperAdminAttendanceView = () => {
  const { data: orgSummary } = useGetTodayOrgSummaryQuery(undefined, {
    pollingInterval: 30000, // Refresh every 30 seconds
  });

  const { data: recentRecords } = useGetAttendanceRecordsQuery({
    page: 1,
    limit: 10,
  });

  const formatTime = (dateString) => {
    if (!dateString) return '--:--';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="space-y-4 animate-fade-in pb-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Attendance Overview
        </h1>
        <p className="text-xs text-muted-foreground mt-1 font-medium">
          View organization-wide attendance records and statistics
        </p>
      </div>

      {/* Today's Organization Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <motion.div
          className="organic-card !p-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-blue-500" />
            <span className="text-xs font-medium text-muted-foreground">Total Employees</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {orgSummary?.data?.totalEmployees || 0}
          </p>
        </motion.div>

        <motion.div
          className="organic-card !p-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <LogIn className="h-4 w-4 text-emerald-500" />
            <span className="text-xs font-medium text-muted-foreground">Checked In</span>
          </div>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {orgSummary?.data?.checkedIn || 0}
          </p>
        </motion.div>

        <motion.div
          className="organic-card !p-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-orange-500" />
            <span className="text-xs font-medium text-muted-foreground">Late Arrivals</span>
          </div>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {orgSummary?.data?.late || 0}
          </p>
        </motion.div>

        <motion.div
          className="organic-card !p-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-purple-500" />
            <span className="text-xs font-medium text-muted-foreground">Attendance %</span>
          </div>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {orgSummary?.data?.attendancePercentage || 0}%
          </p>
        </motion.div>
      </div>

      {/* Recent Check-ins */}
      <motion.div
        className="organic-card !p-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Recent Attendance Records
          </h3>
          <span className="text-xs text-muted-foreground">
            Last {recentRecords?.data?.records?.length || 0} records
          </span>
        </div>

        <div className="space-y-2">
          {recentRecords?.data?.records?.length > 0 ? (
            recentRecords.data.records.map((record) => (
              <div
                key={record._id}
                className="flex items-center justify-between p-3 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      {record.user?.firstName} {record.user?.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {record.employee?.designation?.title || 'Employee'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Check In</p>
                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      {formatTime(record.checkIn?.time)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Check Out</p>
                    <p className="text-sm font-bold text-orange-600 dark:text-orange-400">
                      {record.checkOut?.time ? formatTime(record.checkOut.time) : '--:--'}
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-bold ${
                    record.status === 'present' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                    record.status === 'late' ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400' :
                    'bg-gray-500/10 text-gray-600 dark:text-gray-400'
                  }`}>
                    {record.status}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-sm text-muted-foreground">No attendance records yet</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Info Banner */}
      <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
        <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">Super Admin View</p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            You are viewing organization-wide attendance data. As a Super Admin, you don't need to mark attendance.
          </p>
        </div>
      </div>
    </div>
  );
};

// Employee/Admin/Manager View - Can check-in/check-out
const EmployeeAttendanceView = () => {
  const [checkIn] = useCheckInMutation();
  const [checkOut] = useCheckOutMutation();
  
  const { data: todayStatus } = useGetTodayStatusQuery();
  const { data: summary } = useGetAttendanceSummaryQuery({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
    endDate: new Date().toISOString(),
  });

  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const hasCheckedIn = todayStatus?.data?.checkIn?.time;
  const hasCheckedOut = todayStatus?.data?.checkOut?.time;

  const handleCheckIn = async () => {
    try {
      setIsCheckingIn(true);
      await checkIn({}).unwrap();
      toast.success('Checked in successfully!');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to check in');
    } finally {
      setIsCheckingIn(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setIsCheckingOut(true);
      await checkOut({}).unwrap();
      toast.success('Checked out successfully!');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to check out');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '--:--';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="space-y-4 animate-fade-in pb-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Attendance
        </h1>
        <p className="text-xs text-muted-foreground mt-1 font-medium">
          Manage your daily check-ins and view attendance records
        </p>
      </div>

      {/* Check In/Out Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
        {/* Today's Status Card */}
        <motion.div
          className="organic-card !p-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <Clock className="h-4 w-4 text-blue-500" />
            </div>
            <h3 className="text-sm font-bold text-foreground">Today's Status</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-2">
                <LogIn className="h-4 w-4 text-emerald-500" />
                <span className="text-xs font-medium text-muted-foreground">Check In</span>
              </div>
              <span className="text-sm font-bold text-foreground">
                {formatTime(todayStatus?.data?.checkIn?.time)}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-2">
                <LogOut className="h-4 w-4 text-orange-500" />
                <span className="text-xs font-medium text-muted-foreground">Check Out</span>
              </div>
              <span className="text-sm font-bold text-foreground">
                {formatTime(todayStatus?.data?.checkOut?.time)}
              </span>
            </div>

            {todayStatus?.data?.isLate && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <AlertCircle className="h-3.5 w-3.5 text-orange-500" />
                <span className="text-[10px] font-medium text-orange-600 dark:text-orange-400">
                  Late by {todayStatus.data.lateBy} minutes
                </span>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-border flex gap-2">
            {!hasCheckedIn ? (
              <button
                onClick={handleCheckIn}
                disabled={isCheckingIn}
                className="flex-1 h-9 px-4 rounded-full bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <LogIn className="h-3.5 w-3.5" />
                {isCheckingIn ? 'Checking In...' : 'Check In'}
              </button>
            ) : !hasCheckedOut ? (
              <button
                onClick={handleCheckOut}
                disabled={isCheckingOut}
                className="flex-1 h-9 px-4 rounded-full bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <LogOut className="h-3.5 w-3.5" />
                {isCheckingOut ? 'Checking Out...' : 'Check Out'}
              </button>
            ) : (
              <div className="flex-1 h-9 px-4 rounded-full bg-accent text-xs font-bold flex items-center justify-center gap-2">
                ✓ Attendance Marked
              </div>
            )}
          </div>
        </motion.div>

        {/* Monthly Summary */}
        <motion.div
          className="organic-card !p-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
              <Calendar className="h-4 w-4 text-purple-500" />
            </div>
            <h3 className="text-sm font-bold text-foreground">This Month</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-card border border-border">
              <p className="text-[10px] font-medium text-muted-foreground mb-1">
                Present Days
              </p>
              <p className="text-xl font-bold text-foreground">
                {summary?.data?.presentDays || 0}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-card border border-border">
              <p className="text-[10px] font-medium text-muted-foreground mb-1">
                Absent Days
              </p>
              <p className="text-xl font-bold text-foreground">
                {summary?.data?.absentDays || 0}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-card border border-border">
              <p className="text-[10px] font-medium text-muted-foreground mb-1">
                Late Arrivals
              </p>
              <p className="text-xl font-bold text-foreground">
                {summary?.data?.lateDays || 0}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-card border border-border">
              <p className="text-[10px] font-medium text-muted-foreground mb-1">
                Attendance %
              </p>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                {summary?.data?.attendancePercentage || 0}%
                <TrendingUp className="h-3 w-3" />
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Work Hours Summary */}
      <motion.div
        className="organic-card !p-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-sm font-bold text-foreground mb-3">Work Hours Summary</h3>
        
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 rounded-xl bg-card border border-border">
            <p className="text-[10px] font-medium text-muted-foreground mb-1">
              Total Hours
            </p>
            <p className="text-lg font-bold text-foreground">
              {Math.round(summary?.data?.totalWorkHours || 0)}h
            </p>
          </div>

          <div className="text-center p-3 rounded-xl bg-card border border-border">
            <p className="text-[10px] font-medium text-muted-foreground mb-1">
              Avg Hours/Day
            </p>
            <p className="text-lg font-bold text-foreground">
              {(summary?.data?.avgWorkHours || 0).toFixed(1)}h
            </p>
          </div>

          <div className="text-center p-3 rounded-xl bg-card border border-border">
            <p className="text-[10px] font-medium text-muted-foreground mb-1">
              Overtime
            </p>
            <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
              {Math.round(summary?.data?.totalOvertimeHours || 0)}h
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AttendancePage;
