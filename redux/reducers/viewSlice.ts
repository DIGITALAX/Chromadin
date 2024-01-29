import { Viewer } from "@/components/Common/Interactions/types/interactions.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ViewState {
  value: Viewer;
}

const initialViewState: ViewState = {
  value: Viewer.Stream,
};

export const viewSlice = createSlice({
  name: "view",
  initialState: initialViewState,
  reducers: {
    setView: (state: ViewState, action: PayloadAction<Viewer>) => {
      state.value = action.payload;
    },
  },
});

export const { setView } = viewSlice.actions;

export default viewSlice.reducer;
