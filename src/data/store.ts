import { configureStore } from "@reduxjs/toolkit";
import manifestReducer from "./manifestSlice";

export const store = configureStore({
  reducer: {
    manifest: manifestReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
