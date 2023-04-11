import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface VideoTimeState {
  value: number;
}

const initialVideoTimeState: VideoTimeState = {
  value: 0,
};

export const videoTimeSlice = createSlice({
  name: "videoTime",
  initialState: initialVideoTimeState,
  reducers: {
    setVideoTime: (state: VideoTimeState, action: PayloadAction<number>) => {
      state.value = action.payload;
    },
  },
});

export const { setVideoTime } = videoTimeSlice.actions;

export default videoTimeSlice.reducer;
