import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface VideoInfoState {
  hasMore: boolean;
  paginated: string | undefined;
}

const initialVideoInfoState: VideoInfoState = {
  hasMore: true,
  paginated: undefined,
};

export const videoInfoSlice = createSlice({
  name: "videoInfo",
  initialState: initialVideoInfoState,
  reducers: {
    setVideoInfoRedux: (
      state: VideoInfoState,
      { payload: { actionHasMore, actionPaginated } }
    ) => {
      state.hasMore = actionHasMore;
      state.paginated = actionPaginated;
    },
  },
});

export const { setVideoInfoRedux } = videoInfoSlice.actions;

export default videoInfoSlice.reducer;
