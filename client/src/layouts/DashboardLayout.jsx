import { useState, useEffect, useCallback } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Clock,
  CalendarOff,
  DollarSign,
  BarChart3,
  Package,
  Megaphone,
  UserPlus,
  Star,
  Search,
  Bell,
  LogOut,
  Settings,
  Command,
  Building2,
  Users2,
  Award,
  Network,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import ThemeToggle from '@/components/ThemeToggle';
import CommandPalette from '@/components/CommandPalette';

// Define the top-level modules
const modules = [
  { id: 'overview', name: 'Overview', href: '/dashboard' },
  { id: 'organization', name: 'Organization', href: '/dashboard/departments' },
  { id: 'people', name: 'People', href: '/dashboard/people' },
  { id: 'operations', name: 'Operations', href: '/dashboard/attendance' },
  { id: 'more', name: 'More', href: '/dashboard/assets' },
];

// Define sub-navigation for each module
const subNavigation = {
  organization: [
    { name: 'Departments', href: '/dashboard/departments', icon: Building2 },
    { name: 'Teams', href: '/dashboard/teams', icon: Users2 },
    { name: 'Designations', href: '/dashboard/designations', icon: Award },
    { name: 'Org Chart', href: '/dashboard/org-chart', icon: Network },
  ],
  people: [
    { name: 'Employees', href: '/dashboard/people', icon: Users },
    { name: 'Recruitment', href: '/dashboard/recruitment', icon: UserPlus },
  ],
  operations: [
    { name: 'Attendance', href: '/dashboard/attendance', icon: Clock },
    { name: 'Leave', href: '/dashboard/leave', icon: CalendarOff },
    { name: 'Payroll', href: '/dashboard/payroll', icon: DollarSign },
    { name: 'Performance', href: '/dashboard/performance', icon: Star },
  ],
  more: [
    { name: 'Assets', href: '/dashboard/assets', icon: Package },
    { name: 'Announcements', href: '/dashboard/announcements', icon: Megaphone },
    { name: 'Reports', href: '/dashboard/reports', icon: BarChart3 },
  ],
};

const DashboardLayout = () => {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleKeyDown = useCallback((e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setCommandPaletteOpen((prev) => !prev);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    const handleClick = () => setUserMenuOpen(false);
    if (userMenuOpen) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [userMenuOpen]);

  const getActiveModule = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'overview';
    if (subNavigation.organization.some(item => path.startsWith(item.href))) return 'organization';
    if (subNavigation.people.some(item => path.startsWith(item.href))) return 'people';
    if (subNavigation.operations.some(item => path.startsWith(item.href))) return 'operations';
    if (subNavigation.more.some(item => path.startsWith(item.href))) return 'more';
    return 'overview';
  };

  const activeModule = getActiveModule();
  const activeSubNav = subNavigation[activeModule] || [];

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20 selection:text-primary flex flex-col p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      
      {/* Floating App Window Container */}
      <div className="app-window flex-1 flex flex-col max-w-[1500px] w-full mx-auto relative">
        
        {/* Header - Pill Navigation */}
        <header className="px-6 py-6 sm:px-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-card sticky top-0 z-40 border-b border-border/40">
          
          <div className="flex items-center gap-4">
            {/* Logo Logo */}
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            
            {/* Workspace Label */}
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                PeopleSync
              </h1>
            </div>
          </div>

          {/* Pill-shaped Top Nav */}
          <nav className="hidden lg:flex items-center gap-1 bg-muted/50 p-1.5 rounded-full border border-border/50">
            {modules.map((mod) => {
              const isActive = activeModule === mod.id;
              return (
                <button
                  key={mod.id}
                  onClick={() => navigate(mod.href)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  {mod.name}
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="hidden sm:flex items-center justify-center h-10 w-10 rounded-full bg-muted text-muted-foreground hover:text-foreground transition-colors focus-ring"
            >
              <Search className="h-4 w-4 stroke-[2]" />
            </button>

            <ThemeToggle />
            
            <button className="flex items-center justify-center h-10 w-10 rounded-full bg-muted text-muted-foreground hover:text-foreground transition-colors focus-ring relative">
              <Bell className="h-4 w-4 stroke-[2]" />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-destructive border-2 border-card" />
            </button>

            {/* User Avatar */}
            <div className="relative ml-2">
              <button
                className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shadow-sm hover:scale-105 transition-transform"
                onClick={(e) => {
                  e.stopPropagation();
                  setUserMenuOpen(!userMenuOpen);
                }}
              >
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    className="absolute right-0 top-full mt-3 w-64 rounded-3xl border border-border bg-card p-2 shadow-organic z-50 overflow-hidden"
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                  >
                    <div className="p-4 border-b border-border/50">
                      <p className="text-base font-bold text-foreground">{user?.firstName} {user?.lastName}</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                    <div className="p-2 space-y-1 mt-2">
                      <button
                        onClick={() => navigate('/dashboard/settings')}
                        className="flex items-center gap-3 w-full px-4 py-2.5 rounded-2xl text-sm font-medium text-foreground hover:bg-accent transition-colors"
                      >
                        <Settings className="h-4 w-4 stroke-[2]" />
                        Settings
                      </button>
                      <button
                        onClick={logout}
                        className="flex items-center gap-3 w-full px-4 py-2.5 rounded-2xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <LogOut className="h-4 w-4 stroke-[2]" />
                        Log out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Floating Sub-Navigation */}
        {activeSubNav.length > 0 && (
          <div className="px-6 sm:px-10 py-4 bg-card border-b border-border/40">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
              {activeSubNav.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-medium transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    }`
                  }
                >
                  <item.icon className="h-4 w-4 stroke-[2]" />
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-card p-6 sm:p-10">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      <CommandPalette
        open={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </div>
  );
};

export default DashboardLayout;
