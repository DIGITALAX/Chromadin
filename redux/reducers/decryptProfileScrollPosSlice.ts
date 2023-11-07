import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface DecryptProfileScrollPosState {
  value: number;
}

const initialDecryptProfileScrollPosState: DecryptProfileScrollPosState = {
  value: 0,
};

export const decryptProfileScrollPosSlice = createSlice({
  name: "decryptProfileScrollPos",
  initialState: initialDecryptProfileScrollPosState,
  reducers: {
    setDecryptProfileScrollPosRedux: (state: DecryptProfileScrollPosState, action: PayloadAction<number>) => {
      state.value = action.payload;
    },
  },
});

export const { setDecryptProfileScrollPosRedux } = decryptProfileScrollPosSlice.actions;

export default decryptProfileScrollPosSlice.reducer;
