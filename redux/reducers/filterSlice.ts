import { createSlice } from "@reduxjs/toolkit";

export interface FilterState {
  priceValues: { en: string; es: string }[];
  priceSelected: { en: string; es: string };
  dateValues: { en: string; es: string }[];
  dateSelected: { en: string; es: string };
}

const initialFilterState: FilterState = {
  priceValues: [
    {
      en: "ALL",
      es: "TODO",
    },
    {
      en: "WETH",
      es: "WETH",
    },
    {
      en: "WMATIC",
      es: "WMATIC",
    },
    {
      en: "MONA",
      es: "MONA",
    },
    {
      en: "USDT",
      es: "USDT",
    },
  ],
  priceSelected: {
    en: "ALL",
    es: "TODO",
  },
  dateValues: [
    {
      en: "random",
      es: "aleatorio",
    },
    {
      en: "latest",
      es: "último",
    },
    {
      en: "earliest",
      es: "primero",
    },
  ],
  dateSelected: {
    en: "random",
    es: "aleatorio",
  },
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
