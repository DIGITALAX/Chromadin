import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface StatsState {
  value: any[];
}

const initialStatsState: StatsState = {
  value: [],
};

export const statsSlice = createSlice({
  name: "stats",
  initialState: initialStatsState,
  reducers: {
    setStatsRedux: (state: StatsState, action: PayloadAction<any[]>) => {
      state.value = action.payload;
    },
  },
});

export const { setStatsRedux } = statsSlice.actions;

export default statsSlice.reducer;
