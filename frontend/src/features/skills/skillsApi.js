import { apiSlice } from "@/api/apiSlice";

/**
 * Extended from its Step 2 minimal form (getSkills only) — same file, not a
 * duplicate, per DRY. Now includes the full admin CRUD surface needed for
 * AdminSkillsPage (added this step to close the missing-route gap).
 */
export const skillsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSkills: builder.query({
      query: () => "/skills",
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: "Skill", id: _id })),
              { type: "Skill", id: "LIST" },
            ]
          : [{ type: "Skill", id: "LIST" }],
    }),

    createSkill: builder.mutation({
      query: (body) => ({
        url: "/admin/skills",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Skill", id: "LIST" }],
    }),

    updateSkill: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/admin/skills/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Skill", id },
        { type: "Skill", id: "LIST" },
      ],
    }),

    deleteSkill: builder.mutation({
      // `force` is undefined on the first attempt (safety check), and true
      // on the admin's explicit confirm-anyway retry — matching the
      // backend's ?force=true delete-safety mechanism exactly.
      query: ({ id, force }) => ({
        url: `/admin/skills/${id}${force ? "?force=true" : ""}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Skill", id },
        { type: "Skill", id: "LIST" },
        // A forced delete never cascades on the backend, but any Project or
        // Experience that referenced this skill now has a dangling ID —
        // invalidating their lists keeps their cached techStack display honest.
        { type: "Project", id: "LIST" },
        { type: "Experience", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetSkillsQuery,
  useCreateSkillMutation,
  useUpdateSkillMutation,
  useDeleteSkillMutation,
} = skillsApi;
