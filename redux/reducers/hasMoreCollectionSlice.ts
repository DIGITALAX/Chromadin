import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface HasMoreCollectionsState {
  value: boolean;
}

const initialHasMoreCollectionsState: HasMoreCollectionsState = {
  value: true,
};

export const hasMoreCollectionsSlice = createSlice({
  name: "hasMoreCollections",
  initialState: initialHasMoreCollectionsState,
  reducers: {
    setHasMoreCollectionsRedux: (
      state: HasMoreCollectionsState,
      action: PayloadAction<boolean>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setHasMoreCollectionsRedux } = hasMoreCollectionsSlice.actions;

export default hasMoreCollectionsSlice.reducer;
