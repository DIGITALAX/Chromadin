import { createSlice } from "@reduxjs/toolkit";

export interface HistoryPaginatedState {
  skip: number,
  first: number
}

const initialHistoryPaginatedState: HistoryPaginatedState = {
  skip: 12,
  first: 12
};

export const historyPaginatedSlice = createSlice({
  name: "historyPaginated",
  initialState: initialHistoryPaginatedState,
  reducers: {
    setHistoryPaginated: (
      state: HistoryPaginatedState,
      { payload: { actionSkip, actionFirst } }
    ) => {
      state.skip = actionSkip;
      state.first = actionFirst;
    },
  },
});

export const { setHistoryPaginated } = historyPaginatedSlice.actions;

export default historyPaginatedSlice.reducer;
