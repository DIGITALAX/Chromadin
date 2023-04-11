import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ViewState {
  value: string;
}

const initialViewState: ViewState = {
  value: "stream",
};

export const viewSlice = createSlice({
  name: "view",
  initialState: initialViewState,
  reducers: {
    setView: (state: ViewState, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const { setView } = viewSlice.actions;

export default viewSlice.reducer;
