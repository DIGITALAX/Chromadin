import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface OptionsState {
  value: string;
}

const initialOptionsState: OptionsState = {
  value: "history",
};

export const optionsSlice = createSlice({
  name: "options",
  initialState: initialOptionsState,
  reducers: {
    setOptions: (state: OptionsState, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const { setOptions } = optionsSlice.actions;

export default optionsSlice.reducer;
