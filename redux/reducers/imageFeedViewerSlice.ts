import { createSlice } from "@reduxjs/toolkit";

export interface ImageFeedViewerState {
  type: string;
  open?: boolean;
  image: string;
}

const initialImageFeedViewerState: ImageFeedViewerState = {
  type: "",
  open: false,
  image: "",
};

export const imageFeedViewerSlice = createSlice({
  name: "imageFeedViewer",
  initialState: initialImageFeedViewerState,
  reducers: {
    setImageFeedViewer: (
      state: ImageFeedViewerState,
      { payload: { actionType, actionOpen, actionImage } }
    ) => {
      state.type = actionType;
      state.open = actionOpen;
      state.image = actionImage;
    },
  },
});

export const { setImageFeedViewer } = imageFeedViewerSlice.actions;

export default imageFeedViewerSlice.reducer;
