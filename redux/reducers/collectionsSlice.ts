import { Collection } from "@/components/Home/types/home.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CollectionsState {
  value: Collection[];
}

const initialCollectionsState: CollectionsState = {
  value: [],
};

export const collectionsSlice = createSlice({
  name: "collections",
  initialState: initialCollectionsState,
  reducers: {
    setCollectionsRedux: (
      state: CollectionsState,
      action: PayloadAction<Collection[]>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setCollectionsRedux } = collectionsSlice.actions;

export default collectionsSlice.reducer;
