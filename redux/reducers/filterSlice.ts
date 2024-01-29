import { createSlice } from "@reduxjs/toolkit";

export interface FilterState {
  priceValues: string[];
  priceSelected: string;
  dateValues: string[];
  dateSelected: string;
}

const initialFilterState: FilterState = {
  priceValues: ["ALL", "WETH", "WMATIC", "MONA", "USDT"],
  priceSelected: "ALL",
  dateValues: ["random", "latest", "earliest"],
  dateSelected: "random",
};

export const filterSlice = createSlice({
  name: "filter",
  initialState: initialFilterState,
  reducers: {
    setFilter: (
      state: FilterState,
      {
        payload: {
          actionPriceValues,
          actionPriceSelected,
          actionDateValues,
          actionDateSelected,
        },
      }
    ) => {
      state.priceValues = actionPriceValues;
      state.priceSelected = actionPriceSelected;
      state.dateValues = actionDateValues;
      state.dateSelected = actionDateSelected;
    },
  },
});

export const { setFilter } = filterSlice.actions;

export default filterSlice.reducer;
