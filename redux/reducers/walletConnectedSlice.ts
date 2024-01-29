import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface WalletConnectedState {
  value: boolean;
}

const initialWalletConnectedState: WalletConnectedState = {
  value: false,
};

export const walletConnectedSlice = createSlice({
  name: "walletConnected",
  initialState: initialWalletConnectedState,
  reducers: {
    setWalletConnectedRedux: (
      state: WalletConnectedState,
      action: PayloadAction<boolean>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setWalletConnectedRedux } = walletConnectedSlice.actions;

export default walletConnectedSlice.reducer;
