import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface HasMoreBuyerHistorysState {
  value: {
    new: boolean;
    old: boolean;
  };
}

const initialHasMoreBuyerHistorysState: HasMoreBuyerHistorysState = {
  value: {
    new: true,
    old: true,
  },
};

export const hasMoreBuyerHistorysSlice = createSlice({
  name: "hasMoreBuyerHistorys",
  initialState: initialHasMoreBuyerHistorysState,
  reducers: {
    setHasMoreBuyerHistorysRedux: (
      state: HasMoreBuyerHistorysState,
      action: PayloadAction<{
        new: boolean;
        old: boolean;
      }>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setHasMoreBuyerHistorysRedux } =
  hasMoreBuyerHistorysSlice.actions;

export default hasMoreBuyerHistorysSlice.reducer;
