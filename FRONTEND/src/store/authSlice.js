// authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: false,
  userData: JSON.parse(localStorage.getItem("userData")) || null, // Fetch from localStorage on app load
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.status = true;
      state.userData = action.payload.userData;
      localStorage.setItem("userData", JSON.stringify(state.userData)); // Persist user data in localStorage
    },
    logout: (state) => {
      state.status = false;
      state.userData = null;
      localStorage.removeItem("userData"); // Remove user data from localStorage on logout
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
