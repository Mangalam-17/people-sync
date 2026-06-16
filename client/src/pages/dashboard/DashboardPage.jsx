import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Clock,
  CalendarOff,
  Activity,
  Plus,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  User,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { 
  useGetTodayStatusQuery,
  useGetTodayOrgSummaryQuery 
} from '@/features/attendance/attendanceApi';
import {
  useGetDashboardAnalyticsQuery,
  useGetAttendanceTrendQuery,
  useGetPersonalAnalyticsQuery,
} from '@/features/analytics/analyticsApi';
import AttendanceTrendChart from '@/components/AttendanceTrendChart';
import DepartmentBreakdown from '@/components/DepartmentBreakdown';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Use lowercase role values to match backend
  const isAdmin = user?.role === 'super_admin' || user?.role === 'hr_admin';
  const isManager = user?.role === 'manager';
  const isEmployee = user?.role === 'employee';

  // Fetch appropriate data based on role
  const { data: todayStatus } = useGetTodayStatusQuery(undefined, {
    skip: user?.role === 'super_admin', // Super admin doesn't have personal attendance
  });
  
  const { data: orgSummary } = useGetTodayOrgSummaryQuery(undefined, {
    skip: isEmployee, // Skip org summary for employees
    pollingInterval: 30000, // Refresh every 30 seconds for real-time data
  });

  const { data: dashboardAnalytics } = useGetDashboardAnalyticsQuery(undefined, {
    skip: isEmployee, // Employees get personal analytics instead
    pollingInterval: 60000, // Refresh every minute
  });

  const { data: attendanceTrend } = useGetAttendanceTrendQuery(7, {
    skip: isEmployee,
    pollingInterval: 60000,
  });

  const { data: personalAnalytics } = useGetPersonalAnalyticsQuery(undefined, {
    skip: !isEmployee, // Only for employees
  });

  // Employee Dashboard
  if (isEmployee) {
    return (
      <div className="space-y-4 animate-fade-in pb-6">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Welcome Back!
            </h1>
            <p className="text-xs text-muted-foreground mt-1 font-medium">
              Good afternoon, <span className="text-foreground">{user?.firstName}</span>. Here's your workspace.
            </p>
          </div>
        </div>

        {/* Main Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
          
          {/* My Profile Card */}
          <motion.div
            className="organic-card organic-card-hoverable relative overflow-hidden group !p-4 cursor-pointer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-colors duration-500"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <User className="h-4 w-4 text-blue-500" />
                </div>
                <h3 className="text-sm font-bold text-foreground">My Profile</h3>
              </div>
              
              <div className="space-y-1.5">
                <p className="text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">{user?.firstName} {user?.lastName}</span>
                </p>
                <p className="text-[10px] text-muted-foreground">{user?.email}</p>
                <p className="text-[10px] text-primary font-semibold">{user?.role?.replace('_', ' ')}</p>
              </div>
            </div>
          </motion.div>

          {/* My Attendance Card */}
          <motion.div
            className="organic-card organic-card-hoverable relative overflow-hidden group !p-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-colors duration-500"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <Clock className="h-4 w-4 text-emerald-500" />
                </div>
                <h3 className="text-sm font-bold text-foreground">My Attendance</h3>
              </div>
              
              <div className="flex items-end gap-2">
                <h2 className="text-4xl font-bold tracking-tighter text-foreground">
                  {personalAnalytics?.data?.attendance?.attendancePercentage || 0}%
                </h2>
                <div className="flex flex-col pb-0.5">
                  <span className="text-xs font-bold text-muted-foreground">
                    This Month
                  </span>
                  <span className="text-[10px] text-muted-foreground font-medium">
                    {personalAnalytics?.data?.attendance?.presentDays || 0} days present
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4">
          
          {/* Announcements / Activity */}
          <motion.div
            className="lg:col-span-2 organic-card organic-card-hoverable flex flex-col !p-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Activity className="h-3.5 w-3.5 text-indigo-500" />
                Recent Announcements
              </h3>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center py-8 bg-card rounded-xl border border-border border-dashed">
              <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center mb-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-bold text-foreground mb-1">No announcements yet</p>
              <p className="text-xs text-muted-foreground font-medium text-center max-w-[200px]">
                Company announcements and updates will appear here.
              </p>
            </div>
          </motion.div>

          {/* Quick Actions for Employee */}
          <motion.div
            className="organic-card !p-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <h3 className="text-sm font-bold text-foreground mb-3">Quick Actions</h3>
            
            <div className="space-y-1.5">
              <button
                onClick={() => navigate('/dashboard/attendance')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-card hover:bg-accent border border-transparent hover:border-border transition-all group"
              >
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <Clock className="h-3.5 w-3.5 text-emerald-500" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-foreground">Check In/Out</p>
                    <p className="text-[9px] font-medium text-muted-foreground mt-0.5">
                      {todayStatus?.data?.checkIn?.time ? 'Checked in' : 'Mark attendance'}
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </button>

              <button
                onClick={() => navigate('/dashboard/leaves')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-card hover:bg-accent border border-transparent hover:border-border transition-all group"
              >
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <CalendarOff className="h-3.5 w-3.5 text-purple-500" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-foreground">Request Leave</p>
                    <p className="text-[9px] font-medium text-muted-foreground mt-0.5">Submit an application</p>
                  </div>
                </div>
                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </button>

              <button className="w-full flex items-center justify-between p-2.5 rounded-xl bg-card hover:bg-accent border border-transparent hover:border-border transition-all group">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <User className="h-3.5 w-3.5 text-blue-500" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-foreground">Update Profile</p>
                    <p className="text-[9px] font-medium text-muted-foreground mt-0.5">Edit your information</p>
                  </div>
                </div>
                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    );
  }

  // Admin/Manager Dashboard (existing one)
  const analytics = dashboardAnalytics?.data;
  const trend = attendanceTrend?.data || [];

  // Chart colors
  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

  return (
    <div className="space-y-4 animate-fade-in pb-6">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Overview
          </h1>
          <p className="text-xs text-muted-foreground mt-1 font-medium">
            Good afternoon, <span className="text-foreground">{user?.firstName}</span>. Here's what's happening.
          </p>
        </div>
        
        {isAdmin && (
          <button className="h-9 px-4 rounded-full bg-primary text-primary-foreground text-xs font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-organic-inner">
            <Plus className="h-3.5 w-3.5" />
            Invite Member
          </button>
        )}
      </div>

      {/* Main Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        
        {/* Headcount Card */}
        <motion.div
          className="organic-card organic-card-hoverable relative overflow-hidden group !p-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-colors duration-500"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                <Users className="h-4 w-4 text-blue-500" />
              </div>
              <h3 className="text-sm font-bold text-foreground">Headcount</h3>
            </div>
            
            <div className="flex items-end gap-2">
              <h2 className="text-4xl font-bold tracking-tighter text-foreground">
                {analytics?.overview?.totalEmployees || 0}
              </h2>
              <div className="flex flex-col pb-0.5">
                {analytics?.overview?.headcountGrowth ? (
                  <span className={`text-xs font-bold flex items-center gap-0.5 ${
                    analytics.overview.headcountGrowth >= 0 ? 'text-success' : 'text-destructive'
                  }`}>
                    {analytics.overview.headcountGrowth >= 0 ? (
                      <TrendingUp className="h-2.5 w-2.5" />
                    ) : (
                      <TrendingDown className="h-2.5 w-2.5" />
                    )}
                    {Math.abs(analytics.overview.headcountGrowth)}%
                  </span>
                ) : (
                  <span className="text-xs font-bold text-muted-foreground">--</span>
                )}
                <span className="text-[10px] text-muted-foreground font-medium">vs last month</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Attendance Card */}
        <motion.div
          className="organic-card organic-card-hoverable relative overflow-hidden group !p-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-colors duration-500"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <Clock className="h-4 w-4 text-emerald-500" />
              </div>
              <h3 className="text-sm font-bold text-foreground">Present Today</h3>
            </div>
            
            <div className="flex items-end gap-2">
              <h2 className="text-4xl font-bold tracking-tighter text-foreground">
                {analytics?.overview?.todayAttendancePercentage || 0}%
              </h2>
              <div className="flex flex-col pb-0.5">
                <span className="text-xs font-bold text-muted-foreground">
                  {analytics?.overview?.todayAttendance || 0}/{analytics?.overview?.totalEmployees || 0}
                </span>
                <span className="text-[10px] text-muted-foreground font-medium">Check-ins</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Pending Leaves Card */}
        <motion.div
          className="organic-card organic-card-hoverable relative overflow-hidden group !p-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-colors duration-500"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                <CalendarOff className="h-4 w-4 text-purple-500" />
              </div>
              <h3 className="text-sm font-bold text-foreground">Pending Leaves</h3>
            </div>
            
            <div className="flex items-end gap-2">
              <h2 className="text-4xl font-bold tracking-tighter text-foreground">
                {analytics?.overview?.pendingLeaves || 0}
              </h2>
              <div className="flex flex-col pb-0.5">
                <span className="text-xs font-bold text-muted-foreground">Requests</span>
                <span className="text-[10px] text-muted-foreground font-medium">Need approval</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Late Arrivals Card */}
        <motion.div
          className="organic-card organic-card-hoverable relative overflow-hidden group !p-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-colors duration-500"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-lg bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                <AlertCircle className="h-4 w-4 text-orange-500" />
              </div>
              <h3 className="text-sm font-bold text-foreground">Late Arrivals</h3>
            </div>
            
            <div className="flex items-end gap-2">
              <h2 className="text-4xl font-bold tracking-tighter text-foreground">
                {analytics?.overview?.lateArrivals || 0}
              </h2>
              <div className="flex flex-col pb-0.5">
                <span className="text-xs font-bold text-muted-foreground">This Month</span>
                <span className="text-[10px] text-muted-foreground font-medium">Total count</span>
              </div>
            </div>
          </div>
        </motion.div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4">
        
        {/* Attendance Trend Chart */}
        <motion.div
          className="lg:col-span-2 organic-card organic-card-hoverable flex flex-col !p-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <AttendanceTrendChart data={trend} />
        </motion.div>

        {/* Department Breakdown */}
        <motion.div
          className="organic-card !p-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <DepartmentBreakdown 
            data={analytics?.departmentBreakdown} 
            totalEmployees={analytics?.overview?.totalEmployees}
          />
        </motion.div>

      </div>
    </div>
  );
};

export default DashboardPage;
