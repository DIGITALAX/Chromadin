import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface LitClientState {
  value: any;
}

const initialLitClientState: LitClientState = {
  value: undefined,
};

export const litClientSlice = createSlice({
  name: "litClient",
  initialState: initialLitClientState,
  reducers: {
    setLitClient: (state: LitClientState, action: PayloadAction<any>) => {
      state.value = action.payload;
    },
  },
});

export const { setLitClient } = litClientSlice.actions;

export default litClientSlice.reducer;
