import { Erc20, Profile } from "@/components/Home/types/generated";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface EnabledCurrenciesState {
  value: Erc20[];
}

const initialEnabledCurrenciesState: EnabledCurrenciesState = {
  value: [],
};

export const enabledCurrenciesSlice = createSlice({
  name: "enabledCurrencies",
  initialState: initialEnabledCurrenciesState,
  reducers: {
    setEnabledCurrenciesRedux: (
      state: EnabledCurrenciesState,
      action: PayloadAction<Erc20[]>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setEnabledCurrenciesRedux } = enabledCurrenciesSlice.actions;

export default enabledCurrenciesSlice.reducer;
