import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SuccessState {
  open: boolean;
  media: string;
  name: string;
}

const initialSuccessState: SuccessState = {
  open: false,
  media: "",
  name: "",
};

export const successSlice = createSlice({
  name: "success",
  initialState: initialSuccessState,
  reducers: {
    setSuccess: (
      state: SuccessState,
      { payload: { actionOpen, actionMedia, actionName } }
    ) => {
      state.open = actionOpen;
      state.media = actionMedia;
      state.name = actionName;
    },
  },
});

export const { setSuccess } = successSlice.actions;

export default successSlice.reducer;
