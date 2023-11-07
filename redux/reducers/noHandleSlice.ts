import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface NoHandleState {
  value: boolean;
  message: string;
}

const initialNoHandleState: NoHandleState = {
  value: false,
  message: "",
};

export const nohandleSlice = createSlice({
  name: "nohandle",
  initialState: initialNoHandleState,
  reducers: {
    setNoHandle: (
      state: NoHandleState,
      { payload: { actionValue, actionMessage } }
    ) => {
      state.value = actionValue;
      state.message = actionMessage;
    },
  },
});

export const { setNoHandle } = nohandleSlice.actions;

export default nohandleSlice.reducer;
