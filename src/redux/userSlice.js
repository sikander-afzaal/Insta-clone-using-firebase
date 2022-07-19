import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: "",
  },
  reducers: {
    gettingUser: (state, action) => {
      state.user = { ...action.payload };
    },
    logOut: (state, action) => {
      state.user = "";
    },
  },
});

export const { gettingUser, logOut } = userSlice.actions;
export default userSlice.reducer;
