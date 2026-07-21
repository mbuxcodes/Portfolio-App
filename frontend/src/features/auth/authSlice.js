import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  admin: null, // { email } once logged in
  csrfToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.isAuthenticated = true;
      state.admin = action.payload.admin;
    },
    setCsrfToken: (state, action) => {
      state.csrfToken = action.payload.csrfToken;
    },
    clearCredentials: (state) => {
      state.isAuthenticated = false;
      state.admin = null;
      state.csrfToken = null;
    },
  },
});

export const { setCredentials, setCsrfToken, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
