import { createSlice, PayloadAction } from "@reduxjs/toolkit/react";

export interface ManifestState {
  manifest: any;
}

const initialState: ManifestState = {
  manifest: null,
};

export const manifestSlice = createSlice({
  name: "manifest",
  initialState,
  reducers: {
    setManifest: (state, action: PayloadAction<any>) => {
      state.manifest = action.payload;
    },
  },
});

export const { setManifest } = manifestSlice.actions;

export default manifestSlice.reducer;
