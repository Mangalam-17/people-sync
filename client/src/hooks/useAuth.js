import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  selectCurrentUser,
  selectIsAuthenticated,
  setCredentials,
  logout as logoutAction,
} from '@/features/auth/authSlice';
import { useLogoutMutation } from '@/features/auth/authApi';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [logoutMutation] = useLogoutMutation();

  const login = (data) => {
    dispatch(setCredentials(data));
  };

  const logout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch {
      // Logout anyway even if API call fails
    }
    dispatch(logoutAction());
    navigate('/login');
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    return user.permissions?.includes(permission) || false;
  };

  const hasRole = (...roles) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return {
    user,
    isAuthenticated,
    login,
    logout,
    hasPermission,
    hasRole,
  };
};
