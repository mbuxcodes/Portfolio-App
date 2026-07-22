import { apiSlice } from "@/api/apiSlice";

export const projectsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Public: published projects only, optionally filtered
    getProjects: builder.query({
      query: ({ category, tech } = {}) => {
        const params = new URLSearchParams();
        if (category && category !== "All") params.set("category", category);
        if (tech) params.set("tech", tech);
        const queryString = params.toString();
        return `/projects${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: "Project", id: _id })),
              { type: "Project", id: "LIST" },
            ]
          : [{ type: "Project", id: "LIST" }],
    }),

    getProjectBySlug: builder.query({
      query: (slug) => `/projects/${slug}`,
      providesTags: (result, error, slug) => [{ type: "Project", id: slug }],
    }),

    // Admin: all projects regardless of status
    getAdminProjects: builder.query({
      query: ({ category, status } = {}) => {
        const params = new URLSearchParams();
        if (category && category !== "All") params.set("category", category);
        if (status && status !== "All") params.set("status", status);
        const queryString = params.toString();
        return `/admin/projects${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: "Project", id: _id })),
              { type: "Project", id: "LIST" },
            ]
          : [{ type: "Project", id: "LIST" }],
    }),

    getAdminProjectById: builder.query({
      query: (id) => `/admin/projects/${id}`,
      providesTags: (result, error, id) => [{ type: "Project", id }],
    }),

    createProject: builder.mutation({
      query: (body) => ({
        url: "/admin/projects",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Project", id: "LIST" }],
    }),

    updateProject: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/admin/projects/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Project", id },
        { type: "Project", id: "LIST" },
      ],
    }),

    deleteProject: builder.mutation({
      query: (id) => ({
        url: `/admin/projects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Project", id: "LIST" }],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectBySlugQuery,
  useGetAdminProjectsQuery,
  useGetAdminProjectByIdQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectsApi;
