import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

/**
 * Base query shared by every feature API.
 * - credentials: 'include' sends the HTTP-only auth cookie on every request,
 *   matching the backend's CORS config (Architecture Doc 3).
 * - prepareHeaders attaches the CSRF token (fetched separately via authApi)
 *   to every mutating request, since our backend requires it on admin routes.
 */
const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_API_BASE_URL}/api`,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const csrfToken = getState().auth.csrfToken;
    if (csrfToken) {
      headers.set('X-CSRF-Token', csrfToken);
    }
    return headers;
  },
});

/**
 * The single base API slice for the entire application.
 * Every feature module (projects, skills, messages, etc.) calls
 * `apiSlice.injectEndpoints({ endpoints: ... })` rather than defining
 * its own createApi instance — this keeps one shared cache and one
 * shared set of tag types for cache invalidation.
 */
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: [
    'Project',
    'Skill',
    'Experience',
    'Education',
    'About',
    'Message',
    'Resume',
    'SocialLink',
    'Auth',
  ],
  endpoints: () => ({}),
});
