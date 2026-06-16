import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const attendanceApi = createApi({
  reducerPath: 'attendanceApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/api/v1/attendance`,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.accessToken;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Attendance', 'AttendanceToday'],
  endpoints: (builder) => ({
    // Check in
    checkIn: builder.mutation({
      query: (data) => ({
        url: '/check-in',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['AttendanceToday', 'Attendance'],
    }),

    // Check out
    checkOut: builder.mutation({
      query: (data) => ({
        url: '/check-out',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['AttendanceToday', 'Attendance'],
    }),

    // Get today's status
    getTodayStatus: builder.query({
      query: () => '/today',
      providesTags: ['AttendanceToday'],
    }),

    // Get attendance records
    getAttendanceRecords: builder.query({
      query: (params) => ({
        url: '/',
        params,
      }),
      providesTags: ['Attendance'],
    }),

    // Get attendance summary
    getAttendanceSummary: builder.query({
      query: (params) => ({
        url: '/summary',
        params,
      }),
      providesTags: ['Attendance'],
    }),

    // Get today's organization summary (for admin dashboard)
    getTodayOrgSummary: builder.query({
      query: () => '/today/summary',
      providesTags: ['Attendance'],
    }),

    // Mark absent (admin)
    markAbsent: builder.mutation({
      query: (data) => ({
        url: '/mark-absent',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Attendance'],
    }),

    // Request regularization
    requestRegularization: builder.mutation({
      query: ({ id, reason }) => ({
        url: `/${id}/regularize`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: ['Attendance'],
    }),
  }),
});

export const {
  useCheckInMutation,
  useCheckOutMutation,
  useGetTodayStatusQuery,
  useGetAttendanceRecordsQuery,
  useGetAttendanceSummaryQuery,
  useGetTodayOrgSummaryQuery,
  useMarkAbsentMutation,
  useRequestRegularizationMutation,
} = attendanceApi;
