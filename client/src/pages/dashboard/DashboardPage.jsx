import { motion } from 'framer-motion';
import {
  Users,
  Clock,
  CalendarOff,
  Activity,
  Plus,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 animate-fade-in pb-6">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Overview
          </h1>
          <p className="text-sm text-muted-foreground mt-1 font-medium">
            Good afternoon, <span className="text-foreground">{user?.firstName}</span>. Here's what's happening.
          </p>
        </div>
        
        <button className="h-10 px-5 rounded-full bg-primary text-primary-foreground text-sm font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-organic-inner">
          <Plus className="h-4 w-4" />
          Invite Member
        </button>
      </div>

      {/* Main Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        
        {/* Headcount Card */}
        <motion.div
          className="organic-card organic-card-hoverable relative overflow-hidden group !p-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Decorative Gradient Blob */}
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-colors duration-500"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <h3 className="text-base font-bold text-foreground">Headcount</h3>
            </div>
            
            <div className="flex items-end gap-3">
              <h2 className="text-5xl font-bold tracking-tighter text-foreground">0</h2>
              <div className="flex flex-col pb-1">
                <span className="text-xs font-bold text-success flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +0%
                </span>
                <span className="text-xs text-muted-foreground font-medium">Active members</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Attendance Card */}
        <motion.div
          className="organic-card organic-card-hoverable relative overflow-hidden group !p-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {/* Decorative Gradient Blob */}
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-colors duration-500"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <Clock className="h-5 w-5 text-emerald-500" />
              </div>
              <h3 className="text-base font-bold text-foreground">Present Today</h3>
            </div>
            
            <div className="flex items-end gap-3">
              <h2 className="text-5xl font-bold tracking-tighter text-foreground">0%</h2>
              <div className="flex flex-col pb-1">
                <span className="text-xs font-bold text-muted-foreground">
                  0/0 Check-ins
                </span>
                <span className="text-xs text-muted-foreground font-medium">Across organization</span>
              </div>
            </div>
          </div>
        </motion.div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        
        {/* Large Activity Graph / Empty State */}
        <motion.div
          className="lg:col-span-2 organic-card organic-card-hoverable flex flex-col !p-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Activity className="h-4 w-4 text-indigo-500" />
              Organization Activity
            </h3>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 border border-success/20">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse"></span>
              <span className="text-[10px] text-success font-bold tracking-wider uppercase">Live</span>
            </span>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center py-10 bg-card rounded-2xl border border-border border-dashed">
            <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center mb-3">
              <Activity className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-lg font-bold text-foreground mb-1">No recent activity</p>
            <p className="text-xs text-muted-foreground font-medium text-center max-w-[250px]">
              Activity data like attendance, check-ins, and updates will visualize here.
            </p>
          </div>
        </motion.div>

        {/* Quick Actions Sidebar */}
        <motion.div
          className="organic-card !p-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <h3 className="text-base font-bold text-foreground mb-4">Quick Actions</h3>
          
          <div className="space-y-2">
            <button className="w-full flex items-center justify-between p-3 rounded-2xl bg-card hover:bg-accent border border-transparent hover:border-border transition-all group">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Users className="h-4 w-4 text-blue-500" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-foreground">Add Employee</p>
                  <p className="text-[10px] font-medium text-muted-foreground mt-0.5">Onboard a new member</p>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </button>
            
            <button className="w-full flex items-center justify-between p-3 rounded-2xl bg-card hover:bg-accent border border-transparent hover:border-border transition-all group">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-emerald-500" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-foreground">Mark Attendance</p>
                  <p className="text-[10px] font-medium text-muted-foreground mt-0.5">Check in for today</p>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </button>

            <button className="w-full flex items-center justify-between p-3 rounded-2xl bg-card hover:bg-accent border border-transparent hover:border-border transition-all group">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <CalendarOff className="h-4 w-4 text-purple-500" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-foreground">Request Leave</p>
                  <p className="text-[10px] font-medium text-muted-foreground mt-0.5">Submit an application</p>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default DashboardPage;
