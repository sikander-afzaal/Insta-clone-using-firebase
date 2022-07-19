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
  },
});

export const { gettingUser } = userSlice.actions;
export default userSlice.reducer;
