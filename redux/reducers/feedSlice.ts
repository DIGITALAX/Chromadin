import { Mirror, Post, Quote } from "@/components/Home/types/generated";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FeedsState {
  value: (Quote | Post | Mirror)[];
}

const initialFeedsState: FeedsState = {
  value: [],
};

export const feedsSlice = createSlice({
  name: "feeds",
  initialState: initialFeedsState,
  reducers: {
    setFeedsRedux: (
      state: FeedsState,
      action: PayloadAction<(Quote | Post | Mirror)[]>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setFeedsRedux } = feedsSlice.actions;

export default feedsSlice.reducer;
