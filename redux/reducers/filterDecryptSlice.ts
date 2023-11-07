import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FilterDecryptState {
  value: boolean;
}

const initialFilterDecryptState: FilterDecryptState = {
  value: false,
};

export const filterDecryptSlice = createSlice({
  name: "filterDecrypt",
  initialState: initialFilterDecryptState,
  reducers: {
    setFilterDecrypt: (state: FilterDecryptState, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

export const { setFilterDecrypt } = filterDecryptSlice.actions;

export default filterDecryptSlice.reducer;
