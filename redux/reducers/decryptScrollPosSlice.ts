import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface DecryptScrollPosState {
  value: number;
}

const initialDecryptScrollPosState: DecryptScrollPosState = {
  value: 0,
};

export const decryptScrollPosSlice = createSlice({
  name: "decryptScrollPos",
  initialState: initialDecryptScrollPosState,
  reducers: {
    setDecryptScrollPosRedux: (state: DecryptScrollPosState, action: PayloadAction<number>) => {
      state.value = action.payload;
    },
  },
});

export const { setDecryptScrollPosRedux } = decryptScrollPosSlice.actions;

export default decryptScrollPosSlice.reducer;
