import { apiSlice } from "@/api/apiSlice";

export const resumeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getResume: builder.query({
      query: () => "/resume",
      providesTags: ["Resume"],
    }),

    // `formData` must be a FormData instance built by the caller with a
    // 'resume' field (matching the backend's multer field name). RTK
    // Query's fetchBaseQuery detects FormData automatically and skips
    // JSON-stringifying it or forcing a Content-Type header — the browser
    // sets the correct multipart boundary itself.
    uploadResume: builder.mutation({
      query: (formData) => ({
        url: "/admin/resume",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Resume"],
    }),
  }),
});

export const { useGetResumeQuery, useUploadResumeMutation } = resumeApi;
