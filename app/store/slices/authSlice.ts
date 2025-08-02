// authSlice.ts
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  access: null,
  refresh: null,
  profile_id: null,
  profile_type: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.access = action.payload.access;
      state.refresh = action.payload.refresh;
      state.profile_id = action.payload.profile_id;
      state.profile_type = action.payload.profile_type;
    },
    logout: (state) => {
      state.access = null;
      state.refresh = null;
      state.profile_id = null;
      state.profile_type = null;
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
