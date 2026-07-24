import { apiSlice } from '@/api/apiSlice';

/**
 * Only two endpoints exist here, mirroring the backend exactly — no
 * createAbout/deleteAbout, since About is a singleton (Architecture Doc 2).
 * There's deliberately no `id` parameter needed anywhere; the backend
 * always resolves "the one" document itself.
 */
export const aboutApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAbout: builder.query({
            query: () => '/about',
            providesTags: ['About'],
        }),

        updateAbout: builder.mutation({
            query: (body) => ({
                url: '/admin/about',
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['About'],
        }),
    }),
});

export const { useGetAboutQuery, useUpdateAboutMutation } = aboutApi;