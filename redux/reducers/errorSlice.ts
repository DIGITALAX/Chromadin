import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ErrorState {
  value: boolean;
}

const initialErrorState: ErrorState = {
  value: false,
};

export const errorSlice = createSlice({
  name: "error",
  initialState: initialErrorState,
  reducers: {
    setError: (state: ErrorState, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

export const { setError } = errorSlice.actions;

export default errorSlice.reducer;
