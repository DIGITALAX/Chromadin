import { Collection, Drop } from "@/components/Home/types/home.types";
import { Profile } from "@/components/Home/types/generated";
import { createSlice } from "@reduxjs/toolkit";

export interface AutoDropState {
  drop: Drop | undefined;
  collection: Collection[] | undefined;
  profile: Profile | undefined;
}

const initialAutoDropState: AutoDropState = {
  drop: undefined,
  collection: undefined,
  profile: undefined,
};

export const autoDropSlice = createSlice({
  name: "autoDrop",
  initialState: initialAutoDropState,
  reducers: {
    setAutoDrop: (
      state: AutoDropState,
      { payload: { actionDrop, actionProfile, actionCollection } }
    ) => {
      state.drop = actionDrop;
      state.collection = actionCollection;
      state.profile = actionProfile;
    },
  },
});

export const { setAutoDrop } = autoDropSlice.actions;

export default autoDropSlice.reducer;
