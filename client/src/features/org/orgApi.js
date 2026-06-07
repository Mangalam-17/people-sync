import { apiSlice } from '@/store/api/apiSlice';

export const orgApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // --- Departments ---
    getDepartments: builder.query({
      query: (params) => ({ url: '/departments', params }),
      providesTags: (result) =>
        result?.data
          ? [...result.data.map((d) => ({ type: 'Department', id: d._id })), { type: 'Department', id: 'LIST' }]
          : [{ type: 'Department', id: 'LIST' }],
    }),
    getAllDepartments: builder.query({
      query: () => '/departments/all',
      providesTags: [{ type: 'Department', id: 'LIST' }],
    }),
    getDepartment: builder.query({
      query: (id) => `/departments/${id}`,
      providesTags: (result, error, id) => [{ type: 'Department', id }],
    }),
    createDepartment: builder.mutation({
      query: (data) => ({ url: '/departments', method: 'POST', body: data }),
      invalidatesTags: [{ type: 'Department', id: 'LIST' }, { type: 'OrgChart' }],
    }),
    updateDepartment: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/departments/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Department', id }, { type: 'Department', id: 'LIST' }, { type: 'OrgChart' }],
    }),
    deleteDepartment: builder.mutation({
      query: (id) => ({ url: `/departments/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Department', id: 'LIST' }, { type: 'OrgChart' }],
    }),
    getOrgChart: builder.query({
      query: () => '/departments/org-chart',
      providesTags: ['OrgChart'],
    }),

    // --- Teams ---
    getTeams: builder.query({
      query: (params) => ({ url: '/teams', params }),
      providesTags: (result) =>
        result?.data
          ? [...result.data.map((t) => ({ type: 'Team', id: t._id })), { type: 'Team', id: 'LIST' }]
          : [{ type: 'Team', id: 'LIST' }],
    }),
    getAllTeams: builder.query({
      query: () => '/teams/all',
      providesTags: [{ type: 'Team', id: 'LIST' }],
    }),
    getTeamsByDepartment: builder.query({
      query: (departmentId) => `/teams/department/${departmentId}`,
      providesTags: (result, error, departmentId) => [{ type: 'Team', id: `dept-${departmentId}` }],
    }),
    createTeam: builder.mutation({
      query: (data) => ({ url: '/teams', method: 'POST', body: data }),
      invalidatesTags: [{ type: 'Team', id: 'LIST' }, { type: 'OrgChart' }],
    }),
    updateTeam: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/teams/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Team', id }, { type: 'Team', id: 'LIST' }, { type: 'OrgChart' }],
    }),
    deleteTeam: builder.mutation({
      query: (id) => ({ url: `/teams/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Team', id: 'LIST' }, { type: 'OrgChart' }],
    }),

    // --- Designations ---
    getDesignations: builder.query({
      query: (params) => ({ url: '/designations', params }),
      providesTags: (result) =>
        result?.data
          ? [...result.data.map((d) => ({ type: 'Designation', id: d._id })), { type: 'Designation', id: 'LIST' }]
          : [{ type: 'Designation', id: 'LIST' }],
    }),
    getAllDesignations: builder.query({
      query: () => '/designations/all',
      providesTags: [{ type: 'Designation', id: 'LIST' }],
    }),
    createDesignation: builder.mutation({
      query: (data) => ({ url: '/designations', method: 'POST', body: data }),
      invalidatesTags: [{ type: 'Designation', id: 'LIST' }],
    }),
    updateDesignation: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/designations/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Designation', id }, { type: 'Designation', id: 'LIST' }],
    }),
    deleteDesignation: builder.mutation({
      query: (id) => ({ url: `/designations/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Designation', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetDepartmentsQuery,
  useGetAllDepartmentsQuery,
  useGetDepartmentQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
  useGetOrgChartQuery,
  useGetTeamsQuery,
  useGetAllTeamsQuery,
  useGetTeamsByDepartmentQuery,
  useCreateTeamMutation,
  useUpdateTeamMutation,
  useDeleteTeamMutation,
  useGetDesignationsQuery,
  useGetAllDesignationsQuery,
  useCreateDesignationMutation,
  useUpdateDesignationMutation,
  useDeleteDesignationMutation,
} = orgApi;
