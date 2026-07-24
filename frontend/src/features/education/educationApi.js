import { apiSlice } from "@/api/apiSlice";

export const educationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEducation: builder.query({
      query: () => "/education",
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: "Education", id: _id })),
              { type: "Education", id: "LIST" },
            ]
          : [{ type: "Education", id: "LIST" }],
    }),

    createEducation: builder.mutation({
      query: (body) => ({ url: "/admin/education", method: "POST", body }),
      invalidatesTags: [{ type: "Education", id: "LIST" }],
    }),

    updateEducation: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/admin/education/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Education", id },
        { type: "Education", id: "LIST" },
      ],
    }),

    deleteEducation: builder.mutation({
      query: (id) => ({ url: `/admin/education/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Education", id: "LIST" }],
    }),
  }),
});

export const {
  useGetEducationQuery,
  useCreateEducationMutation,
  useUpdateEducationMutation,
  useDeleteEducationMutation,
} = educationApi;
