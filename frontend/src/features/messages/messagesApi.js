import { apiSlice } from "@/api/apiSlice";

export const messagesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Public — no data is returned by the backend on success (Doc 3), so
    // there's nothing to cache; this exists purely to trigger the request.
    sendMessage: builder.mutation({
      query: (body) => ({
        url: "/messages",
        method: "POST",
        body,
      }),
    }),

    getMessages: builder.query({
      query: ({ status } = {}) => {
        const params = status && status !== "All" ? `?status=${status}` : "";
        return `/admin/messages${params}`;
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: "Message", id: _id })),
              { type: "Message", id: "LIST" },
            ]
          : [{ type: "Message", id: "LIST" }],
    }),

    // Only status/adminNotes are ever sent — matches the backend's
    // deliberately narrow updateMessageSchema (Doc 3): an admin can triage
    // a message, never rewrite what the visitor actually said.
    updateMessage: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/admin/messages/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Message", id },
        { type: "Message", id: "LIST" },
      ],
    }),

    deleteMessage: builder.mutation({
      query: (id) => ({
        url: `/admin/messages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Message", id: "LIST" }],
    }),
  }),
});

export const {
  useSendMessageMutation,
  useGetMessagesQuery,
  useUpdateMessageMutation,
  useDeleteMessageMutation,
} = messagesApi;
