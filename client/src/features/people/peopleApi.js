import { api } from '@/lib/api';

export const peopleApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getEmployees: builder.query({
      query: (params) => ({
        url: '/employees',
        params,
      }),
      providesTags: (result) =>
        result?.data?.employees
          ? [
              ...result.data.employees.map(({ _id }) => ({ type: 'Employee', id: _id })),
              { type: 'Employee', id: 'LIST' },
            ]
          : [{ type: 'Employee', id: 'LIST' }],
    }),

    getEmployeeById: builder.query({
      query: (id) => `/employees/${id}`,
      providesTags: (result, error, id) => [{ type: 'Employee', id }],
    }),

    onboardEmployee: builder.mutation({
      query: (data) => ({
        url: '/employees/onboard',
        method: 'POST',
        data,
      }),
      invalidatesTags: [{ type: 'Employee', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useGetEmployeeByIdQuery,
  useOnboardEmployeeMutation,
} = peopleApi;
