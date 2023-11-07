import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface HasMoreCollectionsState {
  value: {
    new: boolean;
    old: boolean;
  };
}

const initialHasMoreCollectionsState: HasMoreCollectionsState = {
  value: {
    new: true,
    old: true,
  },
};

export const hasMoreCollectionsSlice = createSlice({
  name: "hasMoreCollections",
  initialState: initialHasMoreCollectionsState,
  reducers: {
    setHasMoreCollectionsRedux: (
      state: HasMoreCollectionsState,
      action: PayloadAction<{
        new: boolean;
        old: boolean;
      }>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setHasMoreCollectionsRedux } = hasMoreCollectionsSlice.actions;

export default hasMoreCollectionsSlice.reducer;
