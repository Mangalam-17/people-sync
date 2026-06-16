import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { selectIsAuthenticated, selectCurrentUser, setCredentials, logout } from '@/features/auth/authSlice';
import LoadingScreen from '@/components/LoadingScreen';
import toast from 'react-hot-toast';

/**
 * Protects routes that require authentication.
 * On first load (page refresh), attempts a silent token refresh
 * using the HTTP-only cookie before redirecting to login.
 */
export const ProtectedRoute = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(!isAuthenticated);

  useEffect(() => {
    // If already authenticated (normal navigation), skip the refresh attempt
    if (isAuthenticated) {
      setIsLoading(false);
      return;
    }

    // Attempt silent refresh using the HTTP-only cookie
    const attemptRefresh = async () => {
      try {
        const response = await fetch('/api/v1/auth/refresh', {
          method: 'POST',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data?.accessToken) {
            dispatch(
              setCredentials({
                accessToken: data.data.accessToken,
                user: data.data.user,
              })
            );
          } else {
            dispatch(logout());
          }
        } else {
          dispatch(logout());
        }
      } catch (error) {
        dispatch(logout());
      } finally {
        setIsLoading(false);
      }
    };

    attemptRefresh();
  }, [isAuthenticated, dispatch]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

/**
 * Routes only accessible when NOT authenticated.
 * Redirects to /dashboard if already authenticated.
 */
export const PublicRoute = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

/**
 * Protects routes based on user roles.
 * Redirects to dashboard with error message if user doesn't have required role.
 */
export const RoleGuard = ({ allowedRoles }) => {
  const user = useSelector(selectCurrentUser);

  if (!user || !allowedRoles.includes(user.role)) {
    toast.error('You do not have permission to access this page');
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
