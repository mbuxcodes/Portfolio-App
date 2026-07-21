import { apiSlice } from '@/api/apiSlice';
import { setCredentials, setCsrfToken, clearCredentials } from '@/features/auth/authSlice';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/admin/auth/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(setCredentials({ admin: data.data }));
      },
      invalidatesTags: ['Auth'],
    }),

    logout: builder.mutation({
      query: () => ({
        url: '/admin/auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(clearCredentials());
      },
      invalidatesTags: ['Auth'],
    }),

    getMe: builder.query({
      query: () => '/admin/auth/me',
      providesTags: ['Auth'],
    }),

    getCsrfToken: builder.query({
      query: () => '/admin/auth/csrf-token',
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(setCsrfToken({ csrfToken: data.data.csrfToken }));
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetMeQuery,
  useGetCsrfTokenQuery,
} = authApi;
