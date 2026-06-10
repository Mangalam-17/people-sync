import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from '@/routes/guards';
import AuthLayout from '@/layouts/AuthLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';
import VerifyEmailPage from '@/pages/auth/VerifyEmailPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import DepartmentsPage from '@/pages/org/DepartmentsPage';
import TeamsPage from '@/pages/org/TeamsPage';
import DesignationsPage from '@/pages/org/DesignationsPage';
import OrgChartPage from '@/pages/org/OrgChartPage';
import PeopleDirectory from '@/pages/people/PeopleDirectory';
import EmployeeProfile from '@/pages/people/EmployeeProfile';

export const router = createBrowserRouter([
  // Root redirect
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },

  // Public auth routes (redirect to dashboard if already logged in)
  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/register', element: <RegisterPage /> },
          { path: '/forgot-password', element: <ForgotPasswordPage /> },
          { path: '/reset-password/:token', element: <ResetPasswordPage /> },
        ],
      },
    ],
  },

  // Verify email (accessible without auth)
  {
    path: '/verify-email/:token',
    element: <VerifyEmailPage />,
  },

  // Protected dashboard routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
          // Organization Management
          { path: '/dashboard/departments', element: <DepartmentsPage /> },
          { path: '/dashboard/teams', element: <TeamsPage /> },
          { path: '/dashboard/designations', element: <DesignationsPage /> },
          { path: '/dashboard/org-chart', element: <OrgChartPage /> },
          // People Management
          { path: '/dashboard/people', element: <PeopleDirectory /> },
          { path: '/dashboard/people/:id', element: <EmployeeProfile /> },
          // { path: '/dashboard/attendance', element: <AttendancePage /> },
        ],
      },
    ],
  },

  // 404
  {
    path: '*',
    element: (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">404</h1>
          <p className="text-muted-foreground mb-4">Page not found</p>
          <a href="/dashboard" className="text-primary hover:underline text-sm">
            Go to Dashboard
          </a>
        </div>
      </div>
    ),
  },
]);
