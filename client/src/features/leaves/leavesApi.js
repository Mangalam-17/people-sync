import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const leavesApi = createApi({
  reducerPath: 'leavesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/api/v1/leaves`,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.accessToken;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Leaves', 'LeaveBalance', 'PendingLeaves'],
  endpoints: (builder) => ({
    // Apply for leave
    applyLeave: builder.mutation({
      query: (data) => ({
        url: '/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Leaves', 'LeaveBalance', 'PendingLeaves'],
    }),

    // Get leave requests
    getLeaveRequests: builder.query({
      query: (params) => ({
        url: '/',
        params,
      }),
      providesTags: ['Leaves'],
    }),

    // Get pending leaves
    getPendingLeaves: builder.query({
      query: (params) => ({
        url: '/pending',
        params,
      }),
      providesTags: ['PendingLeaves'],
    }),

    // Get leave balance
    getLeaveBalance: builder.query({
      query: (params) => ({
        url: '/balance',
        params,
      }),
      providesTags: ['LeaveBalance'],
    }),

    // Get employee leave balance (admin)
    getEmployeeLeaveBalance: builder.query({
      query: ({ employeeId, ...params }) => ({
        url: `/balance/${employeeId}`,
        params,
      }),
      providesTags: (result, error, { employeeId }) => [
        { type: 'LeaveBalance', id: employeeId },
      ],
    }),

    // Review leave
    reviewLeave: builder.mutation({
      query: ({ id, decision, reviewNotes }) => ({
        url: `/${id}/review`,
        method: 'PATCH',
        body: { decision, reviewNotes },
      }),
      invalidatesTags: ['Leaves', 'PendingLeaves', 'LeaveBalance'],
    }),

    // Cancel leave
    cancelLeave: builder.mutation({
      query: (id) => ({
        url: `/${id}/cancel`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Leaves', 'LeaveBalance'],
    }),
  }),
});

export const {
  useApplyLeaveMutation,
  useGetLeaveRequestsQuery,
  useGetPendingLeavesQuery,
  useGetLeaveBalanceQuery,
  useGetEmployeeLeaveBalanceQuery,
  useReviewLeaveMutation,
  useCancelLeaveMutation,
} = leavesApi;
