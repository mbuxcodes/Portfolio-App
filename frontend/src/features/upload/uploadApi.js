import { apiSlice } from "@/api/apiSlice";

/**
 * Mirrors resumeApi.js's FormData pattern exactly (Milestone 4) — RTK
 * Query's fetchBaseQuery detects FormData automatically and skips
 * JSON-stringifying it or forcing a Content-Type header, letting the
 * browser set the correct multipart boundary itself.
 */
export const uploadApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadImage: builder.mutation({
      query: (formData) => ({
        url: "/admin/upload/image",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const { useUploadImageMutation } = uploadApi;
