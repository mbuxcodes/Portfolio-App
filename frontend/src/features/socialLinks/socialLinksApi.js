import { apiSlice } from "@/api/apiSlice";

export const socialLinksApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSocialLinks: builder.query({
      query: () => "/social-links",
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({
                type: "SocialLink",
                id: _id,
              })),
              { type: "SocialLink", id: "LIST" },
            ]
          : [{ type: "SocialLink", id: "LIST" }],
    }),

    createSocialLink: builder.mutation({
      query: (body) => ({ url: "/admin/social-links", method: "POST", body }),
      invalidatesTags: [{ type: "SocialLink", id: "LIST" }],
    }),

    updateSocialLink: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/admin/social-links/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "SocialLink", id },
        { type: "SocialLink", id: "LIST" },
      ],
    }),

    deleteSocialLink: builder.mutation({
      query: (id) => ({ url: `/admin/social-links/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "SocialLink", id: "LIST" }],
    }),
  }),
});

export const {
  useGetSocialLinksQuery,
  useCreateSocialLinkMutation,
  useUpdateSocialLinkMutation,
  useDeleteSocialLinkMutation,
} = socialLinksApi;
