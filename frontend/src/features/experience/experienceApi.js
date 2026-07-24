import { apiSlice } from "@/api/apiSlice";

export const experienceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getExperiences: builder.query({
      query: () => "/experiences",
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({
                type: "Experience",
                id: _id,
              })),
              { type: "Experience", id: "LIST" },
            ]
          : [{ type: "Experience", id: "LIST" }],
    }),

    createExperience: builder.mutation({
      query: (body) => ({ url: "/admin/experiences", method: "POST", body }),
      invalidatesTags: [{ type: "Experience", id: "LIST" }],
    }),

    updateExperience: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/admin/experiences/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Experience", id },
        { type: "Experience", id: "LIST" },
      ],
    }),

    deleteExperience: builder.mutation({
      query: (id) => ({ url: `/admin/experiences/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Experience", id: "LIST" }],
    }),
  }),
});

export const {
  useGetExperiencesQuery,
  useCreateExperienceMutation,
  useUpdateExperienceMutation,
  useDeleteExperienceMutation,
} = experienceApi;
