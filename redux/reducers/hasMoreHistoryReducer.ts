import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface HasMoreHistorysState {
  value: {
    old: boolean;
    new: boolean;
  };
}

const initialHasMoreHistorysState: HasMoreHistorysState = {
  value: {
    old: true,
    new: true,
  },
};

export const hasMoreHistorysSlice = createSlice({
  name: "hasMoreHistorys",
  initialState: initialHasMoreHistorysState,
  reducers: {
    setHasMoreHistorysRedux: (
      state: HasMoreHistorysState,
      action: PayloadAction<{
        old: boolean;
        new: boolean;
      }>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setHasMoreHistorysRedux } = hasMoreHistorysSlice.actions;

export default hasMoreHistorysSlice.reducer;
