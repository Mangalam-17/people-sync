import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './api/apiSlice';
import authReducer from '@/features/auth/authSlice';
import { attendanceApi } from '@/features/attendance/attendanceApi';
import { leavesApi } from '@/features/leaves/leavesApi';
import { analyticsApi } from '@/features/analytics/analyticsApi';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [attendanceApi.reducerPath]: attendanceApi.reducer,
    [leavesApi.reducerPath]: leavesApi.reducer,
    [analyticsApi.reducerPath]: analyticsApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(apiSlice.middleware)
      .concat(attendanceApi.middleware)
      .concat(leavesApi.middleware)
      .concat(analyticsApi.middleware),
  devTools: import.meta.env.DEV,
});
