import { motion } from 'framer-motion';
import {
  Users,
  Clock,
  CalendarOff,
  TrendingUp,
  ArrowUpRight,
  Activity,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const statCards = [
  {
    label: 'Total Employees',
    value: '—',
    change: null,
    icon: Users,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    label: 'Present Today',
    value: '—',
    change: null,
    icon: Clock,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    label: 'On Leave',
    value: '—',
    change: null,
    icon: CalendarOff,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  {
    label: 'Open Positions',
    value: '—',
    change: null,
    icon: TrendingUp,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
];

const DashboardPage = () => {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <motion.h1
          className="text-2xl font-bold text-foreground tracking-tight"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {getGreeting()}, {user?.firstName} 👋
        </motion.h1>
        <motion.p
          className="text-muted-foreground text-sm mt-1"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          Here&apos;s what&apos;s happening in your organization today
        </motion.p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="rounded-xl border border-border bg-card p-5 hover:shadow-md transition-shadow"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`h-9 w-9 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`h-4.5 w-4.5 ${stat.color}`} />
              </div>
              {stat.change && (
                <span className="flex items-center gap-0.5 text-xs font-medium text-success">
                  <ArrowUpRight className="h-3 w-3" />
                  {stat.change}
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-foreground tracking-tight">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Activity Feed */}
        <motion.div
          className="lg:col-span-2 rounded-xl border border-border bg-card"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.35 }}
        >
          <div className="flex items-center justify-between p-5 border-b border-border">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
            </div>
            <span className="text-xs text-muted-foreground">Live</span>
          </div>
          <div className="p-8 text-center">
            <div className="mx-auto w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-3">
              <Activity className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Activity feed will appear here once your organization is set up
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Powered by real-time updates
            </p>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="rounded-xl border border-border bg-card"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="p-5 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Quick Actions</h3>
          </div>
          <div className="p-3 space-y-1">
            {[
              { label: 'Add Employee', desc: 'Onboard a new team member' },
              { label: 'Mark Attendance', desc: 'Check in for today' },
              { label: 'Request Leave', desc: 'Submit a leave application' },
              { label: 'View Reports', desc: 'Check analytics dashboard' },
            ].map((action) => (
              <button
                key={action.label}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-accent text-left transition-colors group"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{action.label}</p>
                  <p className="text-xs text-muted-foreground">{action.desc}</p>
                </div>
                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
