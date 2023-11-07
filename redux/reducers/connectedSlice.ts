import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ConnectedState {
  value: boolean;
}

const initialConnectedState: ConnectedState = {
  value: false,
};

export const connectedSlice = createSlice({
  name: "connected",
  initialState: initialConnectedState,
  reducers: {
    setConnectedRedux: (
      state: ConnectedState,
      action: PayloadAction<boolean>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setConnectedRedux } = connectedSlice.actions;

export default connectedSlice.reducer;
