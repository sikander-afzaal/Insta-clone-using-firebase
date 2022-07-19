import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
export const store = configureStore({
  reducer: {
    userState: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["TYPE"],
        ignoredActionPaths: ["property"],
        ignoredPaths: ["reducer.property"],
      },
    }),
});

export default store;
