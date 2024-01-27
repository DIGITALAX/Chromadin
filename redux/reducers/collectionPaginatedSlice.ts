import { createSlice } from "@reduxjs/toolkit";

export interface CollectionPaginatedState {
  skip: number;
  first: number;
}

const initialCollectionPaginatedState: CollectionPaginatedState = {
  skip: 12,
  first: 12,
};

export const collectionPaginatedSlice = createSlice({
  name: "collectionPaginated",
  initialState: initialCollectionPaginatedState,
  reducers: {
    setCollectionPaginated: (
      state: CollectionPaginatedState,
      { payload: { actionSkip, actionFirst } }
    ) => {
      state.skip = actionSkip;
      state.first = actionFirst;
    },
  },
});

export const { setCollectionPaginated } = collectionPaginatedSlice.actions;

export default collectionPaginatedSlice.reducer;
