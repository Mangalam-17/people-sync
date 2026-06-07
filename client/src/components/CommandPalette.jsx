import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Users,
  Clock,
  CalendarOff,
  DollarSign,
  BarChart3,
  LayoutDashboard,
  Package,
  Megaphone,
  UserPlus,
  Star,
  Settings,
  ArrowRight,
  Building2,
  Users2,
  Award,
  Network,
} from 'lucide-react';

const commandItems = [
  { id: 'dashboard', label: 'Go to Dashboard', icon: LayoutDashboard, href: '/dashboard', group: 'Navigation' },
  { id: 'departments', label: 'Go to Departments', icon: Building2, href: '/dashboard/departments', group: 'Organization' },
  { id: 'teams', label: 'Go to Teams', icon: Users2, href: '/dashboard/teams', group: 'Organization' },
  { id: 'designations', label: 'Go to Designations', icon: Award, href: '/dashboard/designations', group: 'Organization' },
  { id: 'org-chart', label: 'Go to Org Chart', icon: Network, href: '/dashboard/org-chart', group: 'Organization' },
  { id: 'people', label: 'Go to People', icon: Users, href: '/dashboard/people', group: 'Navigation' },
  { id: 'attendance', label: 'Go to Attendance', icon: Clock, href: '/dashboard/attendance', group: 'Navigation' },
  { id: 'leave', label: 'Go to Leave', icon: CalendarOff, href: '/dashboard/leave', group: 'Navigation' },
  { id: 'payroll', label: 'Go to Payroll', icon: DollarSign, href: '/dashboard/payroll', group: 'Navigation' },
  { id: 'performance', label: 'Go to Performance', icon: Star, href: '/dashboard/performance', group: 'Navigation' },
  { id: 'recruitment', label: 'Go to Recruitment', icon: UserPlus, href: '/dashboard/recruitment', group: 'Navigation' },
  { id: 'assets', label: 'Go to Assets', icon: Package, href: '/dashboard/assets', group: 'Navigation' },
  { id: 'announcements', label: 'Go to Announcements', icon: Megaphone, href: '/dashboard/announcements', group: 'Navigation' },
  { id: 'reports', label: 'Go to Reports', icon: BarChart3, href: '/dashboard/reports', group: 'Navigation' },
  { id: 'settings', label: 'Go to Settings', icon: Settings, href: '/dashboard/settings', group: 'Navigation' },
];

const CommandPalette = ({ open, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const navigate = useNavigate();

  const filtered = query
    ? commandItems.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase())
      )
    : commandItems;

  // Group by category
  const grouped = filtered.reduce((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {});

  // Focus input on open
  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = useCallback(
    (item) => {
      if (item.href) {
        navigate(item.href);
      }
      onClose();
    },
    [navigate, onClose]
  );

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filtered.length);
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
    }
    if (e.key === 'Enter' && filtered[selectedIndex]) {
      handleSelect(filtered[selectedIndex]);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Palette */}
          <motion.div
            className="fixed top-[20%] left-1/2 z-50 w-full max-w-[560px] -translate-x-1/2"
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.15 }}
          >
            <div className="rounded-xl border border-border bg-popover shadow-2xl overflow-hidden">
              {/* Input */}
              <div className="flex items-center gap-3 px-4 border-b border-border">
                <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a command or search..."
                  className="flex-1 py-3.5 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                />
                <kbd className="hidden sm:inline-flex h-5 items-center rounded border border-border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div ref={listRef} className="max-h-[320px] overflow-y-auto py-2">
                {filtered.length === 0 && (
                  <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No results found for &ldquo;{query}&rdquo;
                  </div>
                )}

                {Object.entries(grouped).map(([group, items]) => (
                  <div key={group}>
                    <div className="px-4 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {group}
                    </div>
                    {items.map((item) => {
                      const globalIndex = filtered.indexOf(item);
                      return (
                        <button
                          key={item.id}
                          className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors ${
                            globalIndex === selectedIndex
                              ? 'bg-accent text-foreground'
                              : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                          }`}
                          onClick={() => handleSelect(item)}
                          onMouseEnter={() => setSelectedIndex(globalIndex)}
                        >
                          <item.icon className="h-4 w-4 flex-shrink-0" />
                          <span className="flex-1 text-left">{item.label}</span>
                          {globalIndex === selectedIndex && (
                            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-2 border-t border-border text-[11px] text-muted-foreground">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <kbd className="inline-flex h-4 items-center rounded border border-border px-1 text-[10px]">↑↓</kbd>
                    Navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="inline-flex h-4 items-center rounded border border-border px-1 text-[10px]">↵</kbd>
                    Select
                  </span>
                </div>
                <span className="flex items-center gap-1">
                  <kbd className="inline-flex h-4 items-center rounded border border-border px-1 text-[10px]">esc</kbd>
                  Close
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
