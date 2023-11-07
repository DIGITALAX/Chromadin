import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ScrollPosState {
  value: number;
}

const initialScrollPosState: ScrollPosState = {
  value: 0,
};

export const scrollPosSlice = createSlice({
  name: "scrollPos",
  initialState: initialScrollPosState,
  reducers: {
    setScrollPosRedux: (state: ScrollPosState, action: PayloadAction<number>) => {
      state.value = action.payload;
    },
  },
});

export const { setScrollPosRedux } = scrollPosSlice.actions;

export default scrollPosSlice.reducer;
