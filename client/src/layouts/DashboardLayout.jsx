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
  LogOut,
  Settings,
  Building2,
  Users2,
  Award,
  Network,
  Sparkles,
  Menu,
  X,
  User,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import ThemeToggle from '@/components/ThemeToggle';
import CommandPalette from '@/components/CommandPalette';

// Role-based module visibility
const getModulesForRole = (role) => {
  const allModules = [
    { id: 'overview', name: 'Overview', href: '/dashboard', roles: ['super_admin', 'admin', 'hr_admin', 'manager', 'employee'] },
    { id: 'organization', name: 'Organization', href: '/dashboard/departments', roles: ['super_admin', 'admin', 'hr_admin'] },
    { id: 'people', name: 'People', href: '/dashboard/people', roles: ['super_admin', 'admin', 'hr_admin', 'manager'] },
    { id: 'operations', name: 'Operations', href: '/dashboard/attendance', roles: ['super_admin', 'admin', 'hr_admin', 'manager', 'employee'] },
    { id: 'more', name: 'More', href: '/dashboard/assets', roles: ['super_admin', 'admin', 'hr_admin'] },
  ];

  return allModules.filter(mod => mod.roles.includes(role));
};

// Role-based sub-navigation visibility
const getSubNavigationForRole = (role) => {
  const allSubNav = {
    organization: [
      { name: 'Departments', href: '/dashboard/departments', icon: Building2, roles: ['super_admin', 'admin', 'hr_admin'] },
      { name: 'Teams', href: '/dashboard/teams', icon: Users2, roles: ['super_admin', 'admin', 'hr_admin'] },
      { name: 'Designations', href: '/dashboard/designations', icon: Award, roles: ['super_admin', 'admin', 'hr_admin'] },
      { name: 'Org Chart', href: '/dashboard/org-chart', icon: Network, roles: ['super_admin', 'admin', 'hr_admin'] },
    ],
    people: [
      { name: 'Employees', href: '/dashboard/people', icon: Users, roles: ['super_admin', 'admin', 'hr_admin', 'manager'] },
      { name: 'Recruitment', href: '/dashboard/recruitment', icon: UserPlus, roles: ['super_admin', 'admin', 'hr_admin'] },
    ],
    operations: [
      // Super Admin - View only, no personal actions
      { name: 'Attendance', href: '/dashboard/attendance', icon: Clock, roles: ['super_admin', 'admin', 'hr_admin', 'manager', 'employee'] },
      { name: 'Leave Approvals', href: '/dashboard/leave-approvals', icon: CalendarOff, roles: ['super_admin', 'admin', 'hr_admin', 'manager'] },
      { name: 'My Leaves', href: '/dashboard/leaves', icon: CalendarOff, roles: ['admin', 'hr_admin', 'manager', 'employee'] }, // NOT super_admin
      { name: 'Payroll', href: '/dashboard/payroll', icon: DollarSign, roles: ['super_admin', 'admin', 'hr_admin'] },
      { name: 'Performance', href: '/dashboard/performance', icon: Star, roles: ['super_admin', 'admin', 'hr_admin', 'manager'] },
    ],
    more: [
      { name: 'Assets', href: '/dashboard/assets', icon: Package, roles: ['super_admin', 'admin', 'hr_admin'] },
      { name: 'Announcements', href: '/dashboard/announcements', icon: Megaphone, roles: ['super_admin', 'admin', 'hr_admin', 'manager', 'employee'] },
      { name: 'Reports', href: '/dashboard/reports', icon: BarChart3, roles: ['super_admin', 'admin', 'hr_admin'] },
    ],
  };

  // Filter sub-navigation based on role
  const filtered = {};
  Object.keys(allSubNav).forEach(key => {
    filtered[key] = allSubNav[key].filter(item => item.roles.includes(role));
  });

  return filtered;
};

const DashboardLayout = () => {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get role-based modules and sub-navigation
  const modules = getModulesForRole(user?.role || 'employee');
  const subNavigation = getSubNavigationForRole(user?.role || 'employee');

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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

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
    <div className="min-h-screen bg-background selection:bg-primary/20 selection:text-primary flex flex-col p-2 sm:p-4 lg:p-8 transition-colors duration-300">
      
      {/* Floating App Window Container */}
      <div className="app-window flex-1 flex flex-col max-w-[1500px] w-full mx-auto relative">
        
        {/* Header */}
        <header className="px-4 py-4 sm:px-6 md:px-10 sm:py-6 flex items-center justify-between gap-4 bg-card sticky top-0 z-40 border-b border-border/40">
          
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Logo */}
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            
            {/* Workspace Label */}
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-foreground hidden sm:block">
              PeopleSync
            </h1>
          </div>

          {/* Desktop Pill Navigation */}
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
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="hidden sm:flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-muted text-muted-foreground hover:text-foreground transition-colors focus-ring"
            >
              <Search className="h-4 w-4 stroke-[2]" />
            </button>

            <ThemeToggle />

            {/* User Avatar */}
            <div className="relative">
              <button
                className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-sm hover:scale-105 transition-transform"
                onClick={(e) => {
                  e.stopPropagation();
                  setUserMenuOpen(!userMenuOpen);
                }}
              >
                <User className="h-5 w-5" />
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
                      <p className="text-xs text-primary mt-1 font-semibold">{user?.role?.replace('_', ' ')}</p>
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

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center justify-center h-9 w-9 rounded-full bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="lg:hidden bg-card border-b border-border/40 px-4 py-4 z-30"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Module Tabs */}
              <div className="flex flex-wrap gap-2 mb-4">
                {modules.map((mod) => {
                  const isActive = activeModule === mod.id;
                  return (
                    <button
                      key={mod.id}
                      onClick={() => navigate(mod.href)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'bg-muted text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {mod.name}
                    </button>
                  );
                })}
              </div>

              {/* Sub-nav items */}
              {activeSubNav.length > 0 && (
                <div className="flex flex-col gap-1 pt-3 border-t border-border/40">
                  {activeSubNav.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all ${
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
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop Sub-Navigation */}
        {activeSubNav.length > 0 && (
          <div className="hidden lg:block px-6 sm:px-10 py-4 bg-card border-b border-border/40">
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
        <main className="flex-1 overflow-y-auto bg-card p-4 sm:p-6 md:p-10">
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
