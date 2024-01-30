import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MetricsState {
  open: boolean;
}

const initialMetricsState: MetricsState = {
  open: false,
};

export const metricsSlice = createSlice({
  name: "metrics",
  initialState: initialMetricsState,
  reducers: {
    setMetrics: (state: MetricsState, action: PayloadAction<boolean>) => {
      state.open = action.payload;
    },
  },
});

export const { setMetrics } = metricsSlice.actions;

export default metricsSlice.reducer;
