import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {
    id: "",
    username: "",
    email: "",
    verificationStatus: false,
    role: "",
  },
  isAuthenticated: false,
  ban: {
    message: "",
    status: false,
  },
};

const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.ban = initialState.ban;
    },
    logoutSuccess: (state) => {
      state.user = initialState.user;
      state.isAuthenticated = false;
      state.ban = initialState.ban;
    },
    banImposed: (state, action) => {
      if (state.ban) {
        state.ban.status = true;
        state.ban.message = action.payload.message;
      } else {
        state.ban = {
          status: true,
          message: action.payload.message,
        };
      }
      state.user = initialState.user;
      state.isAuthenticated = false;
    },
    banRemoved: (state) => {
      state.ban = initialState.ban;
      state.user = initialState.user;
      state.isAuthenticated = false;
    },
    updateVerificationStatus: (state, action) => {
      state.user.verificationStatus = action.payload.verificationStatus;
    },
  },
});

export const {
  loginSuccess,
  logoutSuccess,
  banImposed,
  banRemoved,
  updateVerificationStatus,
} = authSlice.actions;
export default authSlice.reducer;
