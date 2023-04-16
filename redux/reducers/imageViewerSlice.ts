import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ImageViewerState {
  value: boolean;
}

const initialImageViewerState: ImageViewerState = {
  value: false,
};

export const imageViewerSlice = createSlice({
  name: "imageViewer",
  initialState: initialImageViewerState,
  reducers: {
    setImageViewer: (state: ImageViewerState, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

export const { setImageViewer } = imageViewerSlice.actions;

export default imageViewerSlice.reducer;
