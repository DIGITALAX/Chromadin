import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IPFSState {
  value: boolean;
}

const initialIPFSState: IPFSState = {
  value: false,
};

export const IPFSSlice = createSlice({
  name: "IPFS",
  initialState: initialIPFSState,
  reducers: {
    setIPFS: (state: IPFSState, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

export const { setIPFS } = IPFSSlice.actions;

export default IPFSSlice.reducer;
