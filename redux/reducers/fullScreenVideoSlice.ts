import { createSlice } from "@reduxjs/toolkit";

export interface FullScreenVideoState {
  open: boolean;
  duration: number;
  currentTime: number;
  heart: boolean;
  isPlaying: boolean;
  videosLoading: boolean;
  seek: number;
}

const initialFullScreenVideoState: FullScreenVideoState = {
  open: false,
  duration: 0,
  currentTime: 0,
  heart: false,
  isPlaying: false,
  videosLoading: false,
  seek: 0,
};

export const fullScreenVideoSlice = createSlice({
  name: "fullScreenVideo",
  initialState: initialFullScreenVideoState,
  reducers: {
    setFullScreenVideo: (
      state: FullScreenVideoState,
      {
        payload: {
          actionDuration,
          actionCurrentTime,
          actionHeart,
          actionIsPlaying,
          actionVideosLoading,
          actionSeek,
          actionOpen,
        },
      }
    ) => {
      state.open = actionOpen;
      state.duration = actionDuration;
      state.currentTime = actionCurrentTime;
      state.heart = actionHeart;
      state.isPlaying = actionIsPlaying;
      state.videosLoading = actionVideosLoading;
      state.seek = actionSeek;
    },
  },
});

export const { setFullScreenVideo } = fullScreenVideoSlice.actions;

export default fullScreenVideoSlice.reducer;
