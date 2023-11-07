import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface HistoryURLState {
  value: string;
}

const initialHistoryURLState: HistoryURLState = {
  value: "",
};

export const historyURLSlice = createSlice({
  name: "historyURL",
  initialState: initialHistoryURLState,
  reducers: {
    setHistoryURLRedux: (state: HistoryURLState, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const { setHistoryURLRedux } = historyURLSlice.actions;

export default historyURLSlice.reducer;
