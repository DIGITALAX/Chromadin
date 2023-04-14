import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface NoHandleState {
  value: boolean;
}

const initialNoHandleState: NoHandleState = {
  value: false,
};

export const nohandleSlice = createSlice({
  name: "nohandle",
  initialState: initialNoHandleState,
  reducers: {
    setNoHandle: (state: NoHandleState, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

export const { setNoHandle } = nohandleSlice.actions;

export default nohandleSlice.reducer;
