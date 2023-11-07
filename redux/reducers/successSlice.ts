import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SuccessState {
  open: boolean;
  media: string;
  coinOp: boolean;
  name: string;
}

const initialSuccessState: SuccessState = {
  open: false,
  media: "",
  name: "",
  coinOp: false,
};

export const successSlice = createSlice({
  name: "success",
  initialState: initialSuccessState,
  reducers: {
    setSuccess: (
      state: SuccessState,
      { payload: { actionOpen, actionMedia, actionName, actionCoinOp } }
    ) => {
      state.open = actionOpen;
      state.media = actionMedia;
      state.name = actionName;
      state.coinOp = actionCoinOp;
    },
  },
});

export const { setSuccess } = successSlice.actions;

export default successSlice.reducer;
