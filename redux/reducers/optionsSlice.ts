import { Options } from "@/components/Common/Interactions/types/interactions.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface OptionsState {
  value: Options;
}

const initialOptionsState: OptionsState = {
  value: Options.History,
};

export const optionsSlice = createSlice({
  name: "options",
  initialState: initialOptionsState,
  reducers: {
    setOptions: (state: OptionsState, action: PayloadAction<Options>) => {
      state.value = action.payload;
    },
  },
});

export const { setOptions } = optionsSlice.actions;

export default optionsSlice.reducer;
