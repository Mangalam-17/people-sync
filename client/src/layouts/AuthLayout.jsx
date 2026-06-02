import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import ThemeToggle from '@/components/ThemeToggle';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Brand Hero */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#0f172a]">
        {/* Gradient mesh background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-indigo-600/15 blur-[100px]" />
          <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] rounded-full bg-cyan-500/10 blur-[80px]" />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/25">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="text-white text-xl font-semibold tracking-tight">PeopleSync</span>
          </motion.div>

          {/* Hero text */}
          <motion.div
            className="max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
              One Platform for{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                HR Operations
              </span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Manage your entire workforce from a single, modern platform.
              Built for teams that move fast.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2 mt-8">
              {['People', 'Attendance', 'Leave', 'Payroll', 'Performance', 'Assets'].map((item, i) => (
                <motion.span
                  key={item}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 text-slate-300 border border-white/10"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + i * 0.08 }}
                >
                  {item}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Social proof */}
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-[#0f172a] flex items-center justify-center text-xs font-medium text-white"
                  style={{
                    background: `hsl(${210 + i * 25}, 70%, ${45 + i * 5}%)`,
                  }}
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-500">
              Trusted by <span className="text-slate-300 font-medium">500+</span> companies
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="flex justify-end p-4">
          <ThemeToggle />
        </div>

        {/* Form container */}
        <div className="flex-1 flex items-center justify-center px-6 pb-12">
          <motion.div
            className="w-full max-w-[400px]"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Outlet />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
