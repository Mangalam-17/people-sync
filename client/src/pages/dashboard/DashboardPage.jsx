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
  User,
  FileText,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { 
  useGetTodayStatusQuery,
  useGetTodayOrgSummaryQuery 
} from '@/features/attendance/attendanceApi';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Use lowercase role values to match backend
  const isAdmin = user?.role === 'super_admin' || user?.role === 'hr_admin';
  const isManager = user?.role === 'manager';
  const isEmployee = user?.role === 'employee';

  // Fetch appropriate data based on role
  const { data: todayStatus } = useGetTodayStatusQuery(undefined, {
    skip: isAdmin || isManager, // Skip personal attendance for admins/managers
  });
  
  const { data: orgSummary } = useGetTodayOrgSummaryQuery(undefined, {
    skip: isEmployee, // Skip org summary for employees
    pollingInterval: 30000, // Refresh every 30 seconds for real-time data
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
                <h2 className="text-4xl font-bold tracking-tighter text-foreground">0%</h2>
                <div className="flex flex-col pb-0.5">
                  <span className="text-xs font-bold text-muted-foreground">
                    This Month
                  </span>
                  <span className="text-[10px] text-muted-foreground font-medium">Not checked in today</span>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
        
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
                {orgSummary?.data?.totalEmployees || 0}
              </h2>
              <div className="flex flex-col pb-0.5">
                <span className="text-xs font-bold text-success flex items-center gap-0.5">
                  <TrendingUp className="h-2.5 w-2.5" />
                  +0%
                </span>
                <span className="text-[10px] text-muted-foreground font-medium">Active members</span>
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
                {orgSummary?.data?.attendancePercentage || 0}%
              </h2>
              <div className="flex flex-col pb-0.5">
                <span className="text-xs font-bold text-muted-foreground">
                  {orgSummary?.data?.checkedIn || 0}/{orgSummary?.data?.totalEmployees || 0} Check-ins
                </span>
                <span className="text-[10px] text-muted-foreground font-medium">Across organization</span>
              </div>
            </div>
          </div>
        </motion.div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4">
        
        {/* Large Activity Graph / Empty State */}
        <motion.div
          className="lg:col-span-2 organic-card organic-card-hoverable flex flex-col !p-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Activity className="h-3.5 w-3.5 text-indigo-500" />
              Organization Activity
            </h3>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-success/10 border border-success/20">
              <span className="h-1 w-1 rounded-full bg-success animate-pulse"></span>
              <span className="text-[9px] text-success font-bold tracking-wider uppercase">Live</span>
            </span>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center py-8 bg-card rounded-xl border border-border border-dashed">
            <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center mb-2">
              <Activity className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-bold text-foreground mb-1">No recent activity</p>
            <p className="text-xs text-muted-foreground font-medium text-center max-w-[200px]">
              Activity data like attendance, check-ins, and updates will visualize here.
            </p>
          </div>
        </motion.div>

        {/* Quick Actions Sidebar */}
        <motion.div
          className="organic-card !p-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <h3 className="text-sm font-bold text-foreground mb-3">Quick Actions</h3>
          
          <div className="space-y-1.5">
            {isAdmin && (
              <>
                <button
                  onClick={() => navigate('/dashboard/people')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-card hover:bg-accent border border-transparent hover:border-border transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Users className="h-3.5 w-3.5 text-blue-500" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-foreground">Add Employee</p>
                      <p className="text-[9px] font-medium text-muted-foreground mt-0.5">Onboard a new member</p>
                    </div>
                  </div>
                  <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </button>

                <button
                  onClick={() => navigate('/dashboard/attendance')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-card hover:bg-accent border border-transparent hover:border-border transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <Clock className="h-3.5 w-3.5 text-emerald-500" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-foreground">View Attendance</p>
                      <p className="text-[9px] font-medium text-muted-foreground mt-0.5">Check-in/out history</p>
                    </div>
                  </div>
                  <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </button>

                <button
                  onClick={() => navigate('/dashboard/leave-approvals')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-card hover:bg-accent border border-transparent hover:border-border transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-purple-500/10 flex items-center justify-center">
                      <CalendarOff className="h-3.5 w-3.5 text-purple-500" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-foreground">Leave Approvals</p>
                      <p className="text-[9px] font-medium text-muted-foreground mt-0.5">Review requests</p>
                    </div>
                  </div>
                  <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </button>
              </>
            )}
            
            {isManager && (
              <>
                <button
                  onClick={() => navigate('/dashboard/attendance')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-card hover:bg-accent border border-transparent hover:border-border transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <Clock className="h-3.5 w-3.5 text-emerald-500" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-foreground">Team Attendance</p>
                      <p className="text-[9px] font-medium text-muted-foreground mt-0.5">View team status</p>
                    </div>
                  </div>
                  <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </button>

                <button
                  onClick={() => navigate('/dashboard/leave-approvals')}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-card hover:bg-accent border border-transparent hover:border-border transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-purple-500/10 flex items-center justify-center">
                      <CalendarOff className="h-3.5 w-3.5 text-purple-500" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-foreground">Approve Leaves</p>
                      <p className="text-[9px] font-medium text-muted-foreground mt-0.5">Team leave requests</p>
                    </div>
                  </div>
                  <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </button>
              </>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default DashboardPage;
