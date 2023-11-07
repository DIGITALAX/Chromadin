import { createSlice } from "@reduxjs/toolkit";

export interface DateFilterState {
  values: string[];
  selected: string;
}

const initialDateFilterState: DateFilterState = {
  values: ["latest", "earliest"],
  selected: "latest",
};

export const dateFilterSlice = createSlice({
  name: "dateFilter",
  initialState: initialDateFilterState,
  reducers: {
    setDateFilter: (
      state: DateFilterState,
      { payload: { actionValues, actionSelected } }
    ) => {
      state.values = actionValues;
      state.selected = actionSelected;
    },
  },
});

export const { setDateFilter } = dateFilterSlice.actions;

export default dateFilterSlice.reducer;
