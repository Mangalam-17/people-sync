import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Users,
  Clock,
  BarChart3,
  CheckCircle,
  Sparkles,
  Building2,
  TrendingUp,
  Zap,
  Shield,
  Globe,
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

const LandingPage = () => {
  const navigate = useNavigate();

  // Mock employee data for the dashboard preview
  const mockEmployees = [
    {
      name: 'Sarah Anderson',
      role: 'Senior Product Manager',
      department: 'Product',
      status: 'online',
      avatar: 'from-indigo-500 to-purple-600',
      badge: 'bg-blue-500/20 border-blue-500/30',
      badgeText: 'Product',
    },
    {
      name: 'Michael Chen',
      role: 'Lead Software Engineer',
      department: 'Engineering',
      status: 'online',
      avatar: 'from-pink-500 to-orange-600',
      badge: 'bg-purple-500/20 border-purple-500/30',
      badgeText: 'Engineering',
    },
    {
      name: 'Emily Rodriguez',
      role: 'HR Business Partner',
      department: 'People',
      status: 'away',
      avatar: 'from-blue-500 to-cyan-600',
      badge: 'bg-emerald-500/20 border-emerald-500/30',
      badgeText: 'People',
    },
    {
      name: 'James Wilson',
      role: 'Marketing Director',
      department: 'Marketing',
      status: 'offline',
      avatar: 'from-emerald-500 to-teal-600',
      badge: 'bg-orange-500/20 border-orange-500/30',
      badgeText: 'Marketing',
    },
  ];

  const features = [
    {
      icon: Users,
      title: 'People Management',
      description: 'Centralized employee directory with rich profiles and org structure',
      color: 'blue',
    },
    {
      icon: Clock,
      title: 'Time & Attendance',
      description: 'Automated tracking with real-time insights and reporting',
      color: 'emerald',
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reports',
      description: 'Data-driven insights to optimize your workforce decisions',
      color: 'purple',
    },
    {
      icon: Building2,
      title: 'Organization Design',
      description: 'Visual org charts and department management tools',
      color: 'orange',
    },
  ];

  const stats = [
    { label: 'Companies', value: '500+' },
    { label: 'Employees Managed', value: '50K+' },
    { label: 'Time Saved', value: '40%' },
    { label: 'Satisfaction Rate', value: '98%' },
  ];

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20 selection:text-primary overflow-x-hidden">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-foreground">PeopleSync</span>
            </button>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#benefits" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Benefits
              </a>
              <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </a>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-sm font-semibold text-foreground hover:text-primary transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-bold hover:scale-105 transition-transform shadow-lg shadow-primary/20"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 -z-10">
          <motion.div
            className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"
            animate={{
              x: [0, -50, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-5"
              >
                <Zap className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-semibold text-primary">All-in-One HR Platform</span>
              </motion.div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-5 leading-tight">
                Modern HR for
                <br />
                <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Modern Teams
                </span>
              </h1>

              {/* Description */}
              <p className="text-base text-muted-foreground mb-6 leading-relaxed max-w-xl mx-auto lg:mx-0">
                PeopleSync transforms how you manage your workforce. From onboarding to performance tracking, 
                everything you need in one beautiful, intuitive platform.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-6">
                <button
                  onClick={() => navigate('/register')}
                  className="px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-bold hover:scale-105 transition-transform shadow-xl shadow-primary/30 flex items-center justify-center gap-2"
                >
                  Start Free Trial
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="px-6 py-3 rounded-full bg-card text-foreground text-sm font-bold hover:bg-accent transition-colors border border-border flex items-center justify-center gap-2"
                >
                  Watch Demo
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-4 justify-center lg:justify-start text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-success" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-success" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-success" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </motion.div>

            {/* Right: Product Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Floating UI Cards */}
              <div className="relative">
                {/* Main Dashboard Preview - Beautiful Mockup with Animated Mesh Background */}
                <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border border-border p-8">
                  
                  {/* Animated Mesh Gradient Background - HR Themed Colors */}
                  <div className="absolute inset-0 -z-10 overflow-hidden">
                    {/* Gradient Blob 1 - Professional Blue (Trust, Stability) */}
                    <motion.div
                      className="absolute w-96 h-96 rounded-full blur-3xl opacity-40"
                      style={{
                        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, rgba(59, 130, 246, 0) 70%)',
                        top: '-20%',
                        left: '-10%',
                      }}
                      animate={{
                        x: [0, 30, -20, 0],
                        y: [0, -40, 20, 0],
                        scale: [1, 1.1, 0.95, 1],
                      }}
                      transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                    
                    {/* Gradient Blob 2 - Growth Green (Success, Progress) */}
                    <motion.div
                      className="absolute w-80 h-80 rounded-full blur-3xl opacity-35"
                      style={{
                        background: 'radial-gradient(circle, rgba(34, 197, 94, 0.5) 0%, rgba(34, 197, 94, 0) 70%)',
                        top: '40%',
                        right: '-5%',
                      }}
                      animate={{
                        x: [0, -40, 30, 0],
                        y: [0, 30, -20, 0],
                        scale: [1, 0.9, 1.05, 1],
                      }}
                      transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 1,
                      }}
                    />
                    
                    {/* Gradient Blob 3 - Innovation Purple (Creativity, Modern) */}
                    <motion.div
                      className="absolute w-72 h-72 rounded-full blur-3xl opacity-30"
                      style={{
                        background: 'radial-gradient(circle, rgba(168, 85, 247, 0.5) 0%, rgba(168, 85, 247, 0) 70%)',
                        bottom: '10%',
                        left: '30%',
                      }}
                      animate={{
                        x: [0, 20, -30, 0],
                        y: [0, -25, 15, 0],
                        scale: [1, 1.15, 0.95, 1],
                      }}
                      transition={{
                        duration: 18,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 2,
                      }}
                    />
                    
                    {/* Gradient Blob 4 - Energy Orange (Engagement, Warmth) */}
                    <motion.div
                      className="absolute w-64 h-64 rounded-full blur-3xl opacity-25"
                      style={{
                        background: 'radial-gradient(circle, rgba(251, 146, 60, 0.4) 0%, rgba(251, 146, 60, 0) 70%)',
                        top: '60%',
                        left: '10%',
                      }}
                      animate={{
                        x: [0, -25, 35, 0],
                        y: [0, 20, -30, 0],
                        scale: [1, 0.95, 1.1, 1],
                      }}
                      transition={{
                        duration: 14,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 3,
                      }}
                    />

                    {/* Subtle overlay for better content contrast */}
                    <div className="absolute inset-0 bg-card/60 backdrop-blur-sm"></div>
                  </div>

                  {/* Mockup Header */}
                  <div className="flex items-center gap-2 mb-6 relative z-10">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  </div>

                  {/* Mockup Content */}
                  <div className="space-y-4 bg-background/95 backdrop-blur-sm rounded-2xl p-6 relative z-10 shadow-xl">
                    {/* Header Bar with Search */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                          <Users className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <div className="text-[11px] font-bold text-foreground">PeopleSync Dashboard</div>
                          <div className="text-[9px] text-muted-foreground">Acme Corporation</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="h-8 w-32 rounded-lg bg-muted/50 border border-border flex items-center px-2 gap-1.5">
                          <div className="h-3 w-3 rounded bg-muted-foreground/20"></div>
                          <div className="text-[9px] text-muted-foreground">Search...</div>
                        </div>
                        <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                          <div className="h-4 w-4 rounded bg-primary/60"></div>
                        </div>
                      </div>
                    </div>

                    {/* HR Metrics Cards - Analytics Dashboard */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {/* Headcount Card */}
                      <motion.div
                        className="p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20"
                        animate={{ scale: [1, 1.02, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="h-3 w-3 text-blue-500" />
                          <div className="text-[9px] font-semibold text-blue-600 dark:text-blue-400">Headcount</div>
                        </div>
                        <div className="text-xl font-bold text-foreground mb-1">247</div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-2 w-2 text-emerald-500" />
                          <div className="text-[9px] text-emerald-600 dark:text-emerald-400 font-medium">+12% this month</div>
                        </div>
                      </motion.div>

                      {/* Departments Card */}
                      <motion.div
                        className="p-3 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20"
                        animate={{ scale: [1, 1.02, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Building2 className="h-3 w-3 text-purple-500" />
                          <div className="text-[9px] font-semibold text-purple-600 dark:text-purple-400">Departments</div>
                        </div>
                        <div className="text-xl font-bold text-foreground mb-1">8</div>
                        <div className="flex gap-1">
                          <div className="text-[9px] text-muted-foreground">Across 3 locations</div>
                        </div>
                      </motion.div>

                      {/* Attendance Card */}
                      <motion.div
                        className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20"
                        animate={{ scale: [1, 1.02, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-3 w-3 text-emerald-500" />
                          <div className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-400">Attendance</div>
                        </div>
                        <div className="text-xl font-bold text-foreground mb-1">96%</div>
                        <div className="flex items-center gap-1">
                          <div className="text-[9px] text-muted-foreground">238 present today</div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Split Layout: Employee List + Org Chart Preview */}
                    <div className="grid grid-cols-3 gap-4">
                      
                      {/* Left: Employee Directory List (2 columns) */}
                      <div className="col-span-2 space-y-2">
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-xs font-semibold text-foreground/80">Team Directory</div>
                          <div className="text-[10px] text-muted-foreground">4 online</div>
                        </div>

                        {/* Map through real employee data */}
                        {mockEmployees.map((employee, index) => (
                          <motion.div
                            key={employee.name}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-card/50 border border-border/50 hover:border-primary/30 transition-colors"
                            whileHover={{ scale: 1.01 }}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="relative">
                                <div className={`h-9 w-9 rounded-full bg-gradient-to-br ${employee.avatar} flex items-center justify-center text-white text-xs font-bold`}>
                                  {employee.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div 
                                  className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background ${
                                    employee.status === 'online' 
                                      ? 'bg-emerald-500' 
                                      : employee.status === 'away' 
                                      ? 'bg-yellow-500' 
                                      : 'bg-gray-400'
                                  }`}
                                ></div>
                              </div>
                              <div className="space-y-0.5">
                                <div className="text-[11px] font-semibold text-foreground/90">{employee.name}</div>
                                <div className="text-[9px] text-muted-foreground">{employee.role}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className={`px-2 py-0.5 text-[9px] font-medium rounded-full border ${employee.badge}`}>
                                {employee.badgeText}
                              </div>
                              <BarChart3 className="h-3 w-3 text-muted-foreground" />
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Right: Mini Org Chart Preview (1 column) */}
                      <div className="col-span-1 p-3 rounded-xl bg-gradient-to-br from-accent/50 to-accent/30 border border-border/50">
                        <div className="flex items-center gap-2 mb-3">
                          <Globe className="h-3 w-3 text-primary" />
                          <div className="text-[9px] font-semibold text-foreground">Org Structure</div>
                        </div>
                        
                        {/* Org Chart Tree Structure */}
                        <div className="space-y-2">
                          {/* CEO Node */}
                          <div className="flex flex-col items-center">
                            <div className="relative group">
                              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 border-2 border-background shadow-md flex items-center justify-center text-white text-[9px] font-bold">
                                JD
                              </div>
                              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[7px] text-muted-foreground font-medium">
                                CEO
                              </div>
                            </div>
                            <div className="h-6 w-0.5 bg-border/60 my-1"></div>
                          </div>

                          {/* Department Nodes - Row */}
                          <div className="flex justify-center gap-2 mt-4">
                            <div className="flex flex-col items-center">
                              <div className="relative group">
                                <div className="h-6 w-6 rounded-md bg-gradient-to-br from-blue-500 to-blue-600 border border-background shadow-sm flex items-center justify-center text-white text-[8px] font-bold">
                                  MC
                                </div>
                                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[6px] text-muted-foreground">
                                  Eng
                                </div>
                              </div>
                              <div className="h-2 w-0.5 bg-border/50 my-1"></div>
                              <div className="flex gap-1">
                                <div className="h-4 w-4 rounded bg-blue-500/30 text-[7px] flex items-center justify-center text-blue-700 dark:text-blue-300 font-semibold">5</div>
                              </div>
                            </div>

                            <div className="flex flex-col items-center">
                              <div className="relative group">
                                <div className="h-6 w-6 rounded-md bg-gradient-to-br from-purple-500 to-purple-600 border border-background shadow-sm flex items-center justify-center text-white text-[8px] font-bold">
                                  SA
                                </div>
                                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[6px] text-muted-foreground">
                                  Prod
                                </div>
                              </div>
                              <div className="h-2 w-0.5 bg-border/50 my-1"></div>
                              <div className="flex gap-1">
                                <div className="h-4 w-4 rounded bg-purple-500/30 text-[7px] flex items-center justify-center text-purple-700 dark:text-purple-300 font-semibold">3</div>
                              </div>
                            </div>

                            <div className="flex flex-col items-center">
                              <div className="relative group">
                                <div className="h-6 w-6 rounded-md bg-gradient-to-br from-emerald-500 to-emerald-600 border border-background shadow-sm flex items-center justify-center text-white text-[8px] font-bold">
                                  ER
                                </div>
                                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[6px] text-muted-foreground">
                                  HR
                                </div>
                              </div>
                              <div className="h-2 w-0.5 bg-border/50 my-1"></div>
                              <div className="flex gap-1">
                                <div className="h-4 w-4 rounded bg-emerald-500/30 text-[7px] flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-semibold">4</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* View Full Chart Link */}
                        <div className="mt-6 flex items-center justify-center gap-1">
                          <div className="text-[8px] text-primary/80 font-medium">View Full Chart</div>
                          <ArrowRight className="h-2 w-2 text-primary/60" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-card/30 backdrop-blur-sm border-y border-border/40">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-2xl lg:text-3xl font-bold text-foreground mb-1.5">{stat.value}</p>
                <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-accent/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-3">
              Built for Growth, Designed for People
            </h2>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              Transform your HR operations with tools that save time, boost productivity, and create exceptional employee experiences
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Benefit 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-6 rounded-2xl bg-card border border-border hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
            >
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-emerald-500" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Save 40+ Hours Monthly</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Automate repetitive HR tasks</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Focus on strategic initiatives</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Reduce admin overhead by 60%</span>
                </li>
              </ul>
            </motion.div>

            {/* Benefit 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-6 rounded-2xl bg-card border border-border hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
            >
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Data-Driven Decisions</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Real-time workforce analytics</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Predictive insights dashboard</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Custom reporting tools</span>
                </li>
              </ul>
            </motion.div>

            {/* Benefit 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-6 rounded-2xl bg-card border border-border hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
            >
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Boost Employee Experience</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                  <span>Self-service employee portal</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                  <span>Mobile-first responsive design</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                  <span>Seamless onboarding flows</span>
                </li>
              </ul>
            </motion.div>

            {/* Benefit 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="p-6 rounded-2xl bg-card border border-border hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
            >
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500/10 to-orange-500/5 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Enterprise-Grade Security</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span>SOC 2 Type II certified</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span>GDPR & HIPAA compliant</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span>Role-based access control</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-3">
              Why Choose PeopleSync?
            </h2>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              See how we compare to traditional HR management approaches
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="overflow-hidden rounded-2xl border border-border bg-card"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-accent/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-foreground">Feature</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-foreground">Spreadsheets</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-foreground">Legacy HR Software</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-primary bg-primary/5">PeopleSync</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr className="hover:bg-accent/20 transition-colors">
                    <td className="px-6 py-4 text-sm text-foreground font-medium">Setup Time</td>
                    <td className="px-6 py-4 text-center text-sm text-muted-foreground">Hours</td>
                    <td className="px-6 py-4 text-center text-sm text-muted-foreground">Weeks</td>
                    <td className="px-6 py-4 text-center text-sm font-semibold text-emerald-600 dark:text-emerald-400">Minutes</td>
                  </tr>
                  <tr className="hover:bg-accent/20 transition-colors">
                    <td className="px-6 py-4 text-sm text-foreground font-medium">Real-time Analytics</td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-red-500">✕</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-yellow-500">~</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" />
                    </td>
                  </tr>
                  <tr className="hover:bg-accent/20 transition-colors">
                    <td className="px-6 py-4 text-sm text-foreground font-medium">Mobile Access</td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-red-500">✕</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-yellow-500">~</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" />
                    </td>
                  </tr>
                  <tr className="hover:bg-accent/20 transition-colors">
                    <td className="px-6 py-4 text-sm text-foreground font-medium">Automated Workflows</td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-red-500">✕</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-yellow-500">~</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" />
                    </td>
                  </tr>
                  <tr className="hover:bg-accent/20 transition-colors">
                    <td className="px-6 py-4 text-sm text-foreground font-medium">Cost per User</td>
                    <td className="px-6 py-4 text-center text-sm text-muted-foreground">Free*</td>
                    <td className="px-6 py-4 text-center text-sm text-muted-foreground">$$$</td>
                    <td className="px-6 py-4 text-center text-sm font-semibold text-emerald-600 dark:text-emerald-400">$9-19</td>
                  </tr>
                  <tr className="hover:bg-accent/20 transition-colors">
                    <td className="px-6 py-4 text-sm text-foreground font-medium">Support Quality</td>
                    <td className="px-6 py-4 text-center text-sm text-muted-foreground">None</td>
                    <td className="px-6 py-4 text-center text-sm text-muted-foreground">Email only</td>
                    <td className="px-6 py-4 text-center text-sm font-semibold text-emerald-600 dark:text-emerald-400">24/7 Chat</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 bg-accent/20 border-t border-border">
              <p className="text-xs text-muted-foreground">* Hidden costs in time spent on manual data entry and error correction</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-3">
              Everything you need to manage your team
            </h2>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to simplify HR operations and empower your workforce
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-5">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10"
              >
                <div className={`inline-flex h-10 w-10 rounded-xl bg-${feature.color}-500/10 items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`h-5 w-5 text-${feature.color}-500`} />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-accent/20 to-background">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-3">
              Simple, Transparent Pricing
            </h2>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto mb-6">
              Choose the plan that fits your team size and needs. All plans include a 14-day free trial.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Save 20% with annual billing</span>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            
            {/* Starter Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-6 rounded-2xl bg-card border border-border hover:shadow-xl transition-all duration-300"
            >
              <div className="mb-6">
                <h3 className="text-xl font-bold text-foreground mb-2">Starter</h3>
                <p className="text-sm text-muted-foreground mb-4">Perfect for small teams</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-foreground">$9</span>
                  <span className="text-sm text-muted-foreground">/user/month</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/register')}
                className="w-full py-3 rounded-xl bg-accent text-foreground font-semibold hover:bg-accent/80 transition-colors mb-6"
              >
                Start Free Trial
              </button>

              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Up to 25 users</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Core HR management</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Employee directory</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Org chart builder</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Basic reporting</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Email support</span>
                </div>
              </div>
            </motion.div>

            {/* Professional Plan - Featured */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-purple-500/5 border-2 border-primary shadow-xl relative overflow-hidden"
            >
              {/* Popular Badge */}
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                MOST POPULAR
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-bold text-foreground mb-2">Professional</h3>
                <p className="text-sm text-muted-foreground mb-4">For growing companies</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-foreground">$19</span>
                  <span className="text-sm text-muted-foreground">/user/month</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/register')}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:scale-105 transition-transform mb-6 shadow-lg shadow-primary/30"
              >
                Start Free Trial
              </button>

              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground font-medium">Everything in Starter, plus:</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">25-200 users</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Advanced analytics & insights</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Custom roles & permissions</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Third-party integrations</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Automated workflows</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Priority support (24/7)</span>
                </div>
              </div>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-6 rounded-2xl bg-card border border-border hover:shadow-xl transition-all duration-300"
            >
              <div className="mb-6">
                <h3 className="text-xl font-bold text-foreground mb-2">Enterprise</h3>
                <p className="text-sm text-muted-foreground mb-4">For large organizations</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-foreground">Custom</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/register')}
                className="w-full py-3 rounded-xl bg-accent text-foreground font-semibold hover:bg-accent/80 transition-colors mb-6"
              >
                Contact Sales
              </button>

              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground font-medium">Everything in Professional, plus:</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Unlimited users</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Dedicated account manager</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">SSO & SAML authentication</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Advanced API access</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">White-glove onboarding</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Custom SLA & uptime guarantee</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-8 text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span className="text-sm font-medium">SOC 2 Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-medium">GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              <span className="text-sm font-medium">99.9% Uptime</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-3">
              Loved by HR Teams Worldwide
            </h2>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              See what our customers have to say about transforming their HR operations
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Testimonial 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-6 rounded-2xl bg-card border border-border hover:shadow-xl transition-all duration-300"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Sparkles key={i} className="h-4 w-4 text-amber-500 fill-amber-500" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                "PeopleSync transformed our HR operations completely. We saved over 15 hours per week on manual tasks and our employee satisfaction scores increased by 40%."
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white text-xs font-bold">
                  SJ
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Sarah Johnson</p>
                  <p className="text-xs text-muted-foreground">VP of HR, TechCorp</p>
                </div>
              </div>
            </motion.div>

            {/* Testimonial 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-6 rounded-2xl bg-card border border-border hover:shadow-xl transition-all duration-300"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Sparkles key={i} className="h-4 w-4 text-amber-500 fill-amber-500" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                "The analytics dashboard gives us insights we never had before. Making data-driven decisions about our workforce has never been easier. Highly recommend!"
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-xs font-bold">
                  MP
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Michael Park</p>
                  <p className="text-xs text-muted-foreground">COO, GrowthLabs</p>
                </div>
              </div>
            </motion.div>

            {/* Testimonial 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-6 rounded-2xl bg-card border border-border hover:shadow-xl transition-all duration-300"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Sparkles key={i} className="h-4 w-4 text-amber-500 fill-amber-500" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                "Best HR software we've ever used. The onboarding experience is seamless, and our new hires love the self-service portal. Game changer for our team!"
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold">
                  ER
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Emily Rodriguez</p>
                  <p className="text-xs text-muted-foreground">HR Director, Innovate Inc</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-accent/20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-muted-foreground">
              Everything you need to know about PeopleSync
            </p>
          </motion.div>

          <div className="space-y-4">
            {/* FAQ 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-6 rounded-2xl bg-card border border-border"
            >
              <h3 className="text-base font-bold text-foreground mb-2">How long does implementation take?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Most teams are up and running within 24 hours. Our intuitive setup wizard guides you through the process, and our support team is available 24/7 if you need any assistance. Enterprise customers get dedicated onboarding support.
              </p>
            </motion.div>

            {/* FAQ 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-6 rounded-2xl bg-card border border-border"
            >
              <h3 className="text-base font-bold text-foreground mb-2">Can we migrate from our current HR system?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Absolutely! We provide tools and support to help you migrate your data from spreadsheets, legacy HR systems, or other platforms. Our team can handle the entire migration process for you, ensuring zero data loss.
              </p>
            </motion.div>

            {/* FAQ 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-6 rounded-2xl bg-card border border-border"
            >
              <h3 className="text-base font-bold text-foreground mb-2">What integrations do you support?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                PeopleSync integrates with popular tools like Slack, Microsoft Teams, Google Workspace, Zoom, and many payroll providers. Professional and Enterprise plans get access to our REST API for custom integrations.
              </p>
            </motion.div>

            {/* FAQ 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="p-6 rounded-2xl bg-card border border-border"
            >
              <h3 className="text-base font-bold text-foreground mb-2">Is there a free trial?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Yes! All plans come with a 14-day free trial. No credit card required. You get full access to all features during the trial period, and you can cancel anytime if it's not the right fit.
              </p>
            </motion.div>

            {/* FAQ 5 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="p-6 rounded-2xl bg-card border border-border"
            >
              <h3 className="text-base font-bold text-foreground mb-2">How secure is our data?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Security is our top priority. We're SOC 2 Type II certified, GDPR and HIPAA compliant, and use bank-level encryption. Your data is stored in secure, redundant data centers with 99.9% uptime guarantee. We also offer SSO and SAML for Enterprise customers.
              </p>
            </motion.div>

            {/* FAQ 6 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="p-6 rounded-2xl bg-card border border-border"
            >
              <h3 className="text-base font-bold text-foreground mb-2">Can I change plans later?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any charges or credits. There are no long-term contracts or cancellation fees.
              </p>
            </motion.div>
          </div>

          {/* Still have questions CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12 text-center"
          >
            <p className="text-sm text-muted-foreground mb-4">Still have questions?</p>
            <button
              onClick={() => navigate('/register')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-bold hover:scale-105 transition-transform"
            >
              Contact Our Team
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl lg:text-4xl font-bold text-foreground mb-4">
              Ready to transform your HR?
            </h2>
            <p className="text-sm lg:text-base text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join hundreds of companies using PeopleSync to build better, more efficient teams.
            </p>
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-3 rounded-full bg-primary text-primary-foreground text-sm font-bold hover:scale-105 transition-transform shadow-2xl shadow-primary/30 inline-flex items-center gap-2"
            >
              Start Your Free Trial
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-border/40">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-base font-bold text-foreground">PeopleSync</span>
            </button>
            <p className="text-xs text-muted-foreground">
              © 2026 PeopleSync. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
