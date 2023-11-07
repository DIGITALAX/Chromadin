import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface RatesState {
  value: any[];
}

const initialRatesState: RatesState = {
  value: [],
};

export const ratesSlice = createSlice({
  name: "rates",
  initialState: initialRatesState,
  reducers: {
    setRatesRedux: (state: RatesState, action: PayloadAction<any[]>) => {
      state.value = action.payload;
    },
  },
});

export const { setRatesRedux } = ratesSlice.actions;

export default ratesSlice.reducer;
