import { createSlice } from "@reduxjs/toolkit";

export interface DecryptState {
  open: boolean;
  collections: string[];
  owner: string | undefined;
}

const initialDecryptState: DecryptState = {
  open: false,
  collections: [],
  owner: undefined,
};

export const decryptSlice = createSlice({
  name: "decrypt",
  initialState: initialDecryptState,
  reducers: {
    setDecrypt: (
      state: DecryptState,
      { payload: { actionOpen, actionCollections, actionName } }
    ) => {
      state.open = actionOpen;
      state.collections = actionCollections;
      state.owner = actionName;
    },
  },
});

export const { setDecrypt } = decryptSlice.actions;

export default decryptSlice.reducer;
