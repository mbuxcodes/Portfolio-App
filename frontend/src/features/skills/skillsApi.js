import { apiSlice } from "@/api/apiSlice";

/**
 * Minimal by design: only getSkills exists here right now, because Project's
 * create/edit form genuinely needs the real skill list for its techStack
 * selector. Skills' own admin CRUD integration (create/update/delete
 * endpoints) is a separate future step — when that happens, this same file
 * gets extended, not duplicated.
 */
export const skillsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSkills: builder.query({
      query: () => "/skills",
      providesTags: ["Skill"],
    }),
  }),
});

export const { useGetSkillsQuery } = skillsApi;
