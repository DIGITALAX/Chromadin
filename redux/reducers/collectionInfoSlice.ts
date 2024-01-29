import { Collection } from "@/components/Home/types/home.types";
import { createSlice } from "@reduxjs/toolkit";

export interface CollectionInfoState {
  skip: number;
  collections: Collection[];
  hasMore: boolean;
  main: Collection | undefined;
}

const initialCollectionInfoState: CollectionInfoState = {
  skip: 0,
  hasMore: true,
  collections: [],
  main: undefined,
};

export const collectionInfoSlice = createSlice({
  name: "collectionInfo",
  initialState: initialCollectionInfoState,
  reducers: {
    setCollectionInfo: (
      state: CollectionInfoState,
      { payload: { actionSkip, actionCollections, actionHasMore, actionMain } }
    ) => {
      state.skip = actionSkip;
      state.collections = actionCollections;
      state.hasMore = actionHasMore;
      state.main = actionMain;
    },
  },
});

export const { setCollectionInfo } = collectionInfoSlice.actions;

export default collectionInfoSlice.reducer;
