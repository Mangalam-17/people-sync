import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const analyticsApi = createApi({
  reducerPath: 'analyticsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/api/v1/analytics`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Analytics', 'Trend', 'Report'],
  endpoints: (builder) => ({
    // Get dashboard analytics
    getDashboardAnalytics: builder.query({
      query: () => '/dashboard',
      providesTags: ['Analytics'],
    }),

    // Get attendance trend
    getAttendanceTrend: builder.query({
      query: (days = 7) => `/attendance-trend?days=${days}`,
      providesTags: ['Trend'],
    }),

    // Get monthly attendance report
    getMonthlyAttendanceReport: builder.query({
      query: ({ month, year }) => `/attendance-report?month=${month}&year=${year}`,
      providesTags: ['Report'],
    }),

    // Get department analytics
    getDepartmentAnalytics: builder.query({
      query: () => '/department',
      providesTags: ['Analytics'],
    }),

    // Get employee growth trend
    getEmployeeGrowthTrend: builder.query({
      query: () => '/growth-trend',
      providesTags: ['Trend'],
    }),

    // Get personal analytics
    getPersonalAnalytics: builder.query({
      query: () => '/personal',
      providesTags: ['Analytics'],
    }),
  }),
});

export const {
  useGetDashboardAnalyticsQuery,
  useGetAttendanceTrendQuery,
  useGetMonthlyAttendanceReportQuery,
  useGetDepartmentAnalyticsQuery,
  useGetEmployeeGrowthTrendQuery,
  useGetPersonalAnalyticsQuery,
} = analyticsApi;
