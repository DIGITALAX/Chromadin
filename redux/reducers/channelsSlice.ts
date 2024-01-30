import { Quest } from "@/components/Common/Video/types/controls.types";
import { Post } from "@/components/Home/types/generated";
import { createSlice } from "@reduxjs/toolkit";

export interface ChannelsState {
  channels: Post[];
  main: Post | undefined;
}

const initialChannelsState: ChannelsState = {
  channels: [],
  main: undefined,
};

export const channelsSlice = createSlice({
  name: "channels",
  initialState: initialChannelsState,
  reducers: {
    setChannelsRedux: (
      state: ChannelsState,
      { payload: { actionChannels, actionMain } }
    ) => {
      state.channels = actionChannels;
      state.main = actionMain;
    },
  },
});

export const { setChannelsRedux } = channelsSlice.actions;

export default channelsSlice.reducer;
