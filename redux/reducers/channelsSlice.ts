import { Post } from "@/components/Home/types/generated";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ChannelsState {
  value: Post[];
}

const initialChannelsState: ChannelsState = {
  value: [],
};

export const channelsSlice = createSlice({
  name: "channels",
  initialState: initialChannelsState,
  reducers: {
    setChannelsRedux: (state: ChannelsState, action: PayloadAction<Post[]>) => {
      state.value = action.payload;
    },
  },
});

export const { setChannelsRedux } = channelsSlice.actions;

export default channelsSlice.reducer;
