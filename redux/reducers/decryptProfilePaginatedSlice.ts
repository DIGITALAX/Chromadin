import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface DecryptProfilePaginatedState {
  value: string | undefined;
}

const initialDecryptProfilePaginatedState: DecryptProfilePaginatedState = {
  value: undefined,
};

export const decryptProfilePaginatedSlice = createSlice({
  name: "decryptProfilePaginated",
  initialState: initialDecryptProfilePaginatedState,
  reducers: {
    setDecryptProfilePaginated: (
      state: DecryptProfilePaginatedState,
      action: PayloadAction<any>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setDecryptProfilePaginated } = decryptProfilePaginatedSlice.actions;

export default decryptProfilePaginatedSlice.reducer;
