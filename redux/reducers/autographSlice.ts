import { Collection, Drop } from "@/components/Home/types/home.types";
import { Profile } from "@/components/Home/types/generated";
import { createSlice } from "@reduxjs/toolkit";

export interface AutographState {
  drops: Drop[] | undefined;
  collections: Collection[] | undefined;
  profile: Profile | undefined;
}

const initialAutographState: AutographState = {
  drops: undefined,
  collections: undefined,
  profile: undefined,
};

export const autographSlice = createSlice({
  name: "autograph",
  initialState: initialAutographState,
  reducers: {
    setAutograph: (
      state: AutographState,
      { payload: { actionDrops, actionProfile, actionCollections } }
    ) => {
      state.drops = actionDrops;
      state.collections = actionCollections;
      state.profile = actionProfile;
    },
  },
});

export const { setAutograph } = autographSlice.actions;

export default autographSlice.reducer;
