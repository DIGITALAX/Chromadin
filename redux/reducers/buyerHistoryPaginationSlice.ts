import { createSlice } from "@reduxjs/toolkit";

export interface BuyerHistoryPaginatedState {
  skip: number,
  first: number
}

const initialBuyerHistoryPaginatedState: BuyerHistoryPaginatedState = {
  skip: 12,
  first: 12
};

export const buyerBuyerHistoryPaginatedSlice = createSlice({
  name: "buyerBuyerHistoryPaginated",
  initialState: initialBuyerHistoryPaginatedState,
  reducers: {
    setBuyerHistoryPaginated: (
      state: BuyerHistoryPaginatedState,
      { payload: { actionSkip, actionFirst } }
    ) => {
      state.skip = actionSkip;
      state.first = actionFirst;
    },
  },
});

export const { setBuyerHistoryPaginated } = buyerBuyerHistoryPaginatedSlice.actions;

export default buyerBuyerHistoryPaginatedSlice.reducer;
