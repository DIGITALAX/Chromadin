import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface EncryptedInfoState {
  information: string[] | undefined;
}

const initialEncryptedInfoState: EncryptedInfoState = {
  information: undefined,
};

export const encryptedInfoSlice = createSlice({
  name: "encryptedInfo",
  initialState: initialEncryptedInfoState,
  reducers: {
    setEncryptedInfo: (
      state: EncryptedInfoState,
      action: PayloadAction<string[] | undefined>
    ) => {
      state.information = action.payload;
    },
  },
});

export const { setEncryptedInfo } = encryptedInfoSlice.actions;

export default encryptedInfoSlice.reducer;
