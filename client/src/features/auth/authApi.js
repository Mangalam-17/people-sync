import { apiSlice } from '@/store/api/apiSlice';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: '/auth/register',
        method: 'POST',
        body: data,
      }),
    }),

    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),

    getMe: builder.query({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),

    verifyEmail: builder.query({
      query: (token) => `/auth/verify-email/${token}`,
    }),

    forgotPassword: builder.mutation({
      query: (data) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: data,
      }),
    }),

    resetPassword: builder.mutation({
      query: ({ token, ...data }) => ({
        url: `/auth/reset-password/${token}`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetMeQuery,
  useVerifyEmailQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
