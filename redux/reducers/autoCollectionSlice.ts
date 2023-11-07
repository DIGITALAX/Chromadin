import { Collection } from "@/components/Home/types/home.types";
import { Profile } from "@/components/Home/types/generated";
import { createSlice } from "@reduxjs/toolkit";

export interface AutoCollectionState {
  collection: Collection | undefined;
  profile: Profile | undefined;
}

const initialAutoCollectionState: AutoCollectionState = {
  collection: undefined,
  profile: undefined,
};

export const autoCollectionSlice = createSlice({
  name: "autoCollection",
  initialState: initialAutoCollectionState,
  reducers: {
    setAutoCollection: (
      state: AutoCollectionState,
      { payload: { actionCollection, actionProfile } }
    ) => {
      state.collection = actionCollection;
      state.profile = actionProfile;
    },
  },
});

export const { setAutoCollection } =
  autoCollectionSlice.actions;

export default autoCollectionSlice.reducer;
