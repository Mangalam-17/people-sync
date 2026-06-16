import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import ThemeToggle from '@/components/ThemeToggle';
import { Sparkles } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-8 transition-colors duration-300">
      
      {/* Absolute Theme Toggle at Top Right */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <motion.div
        className="app-window w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 min-h-[600px] relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Left Panel — Brand Hero (Takes on the background color) */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-card relative z-10 border-r border-border">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">PeopleSync</span>
          </div>

          {/* Hero text */}
          <div className="max-w-md my-auto">
            <h1 className="text-4xl font-bold text-foreground leading-tight mb-4 tracking-tight">
              Manage your workforce <br />
              <span className="text-primary">beautifully.</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              The modern HR platform built for teams that move fast. Everything you need, wrapped in an elegant interface.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2 mt-8">
              {['People', 'Attendance', 'Leave', 'Payroll', 'Performance'].map((item, i) => (
                <span
                  key={item}
                  className="px-4 py-2 rounded-full text-xs font-bold bg-accent text-accent-foreground border border-border"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel — Form */}
        <div className="flex items-center justify-center p-8 sm:p-12 bg-background relative">
          
          {/* Decorative Gradient Blob for the organic feel */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="w-full max-w-md relative z-10">
            {/* Mobile Logo (only visible on smaller screens where left panel is hidden) */}
            <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">PeopleSync</span>
            </div>
            
            <Outlet />
          </div>
        </div>
      </motion.div>

    </div>
  );
};

export default AuthLayout;
