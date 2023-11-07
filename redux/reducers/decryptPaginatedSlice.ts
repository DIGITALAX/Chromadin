import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface DecryptPaginatedState {
  value: any;
}

const initialDecryptPaginatedState: DecryptPaginatedState = {
  value: {},
};

export const decryptPaginatedSlice = createSlice({
  name: "decryptPaginated",
  initialState: initialDecryptPaginatedState,
  reducers: {
    setDecryptPaginated: (
      state: DecryptPaginatedState,
      action: PayloadAction<any>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setDecryptPaginated } = decryptPaginatedSlice.actions;

export default decryptPaginatedSlice.reducer;
