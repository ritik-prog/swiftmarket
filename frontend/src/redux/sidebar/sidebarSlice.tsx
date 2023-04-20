import { createSlice } from "@reduxjs/toolkit";

const sidebarSlice = createSlice({
  name: "theme",
  initialState: { type: "orders" },
  reducers: {
    setType(state, action) {
      state.type = action.payload;
    },
  },
});

export const { setType } = sidebarSlice.actions;

export default sidebarSlice.reducer;
