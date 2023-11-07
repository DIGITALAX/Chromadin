import { createSlice } from "@reduxjs/toolkit";

export interface PriceFilterState {
  values: string[];
  selected: string;
}

const initialPriceFilterState: PriceFilterState = {
  values: ["ALL", "WETH", "WMATIC", "MONA", "USDT"],
  selected: "ALL",
};

export const priceFilterSlice = createSlice({
  name: "priceFilter",
  initialState: initialPriceFilterState,
  reducers: {
    setPriceFilter: (
      state: PriceFilterState,
      { payload: { actionValues, actionSelected } }
    ) => {
      state.values = actionValues;
      state.selected = actionSelected;
    },
  },
});

export const { setPriceFilter } = priceFilterSlice.actions;

export default priceFilterSlice.reducer;
