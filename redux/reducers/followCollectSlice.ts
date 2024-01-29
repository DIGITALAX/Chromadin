import {
  MultirecipientFeeCollectOpenActionSettings,
  Profile,
  SimpleCollectOpenActionSettings,
} from "@/components/Home/types/generated";
import { createSlice } from "@reduxjs/toolkit";

export interface FollowCollectState {
  type: "follow" | "collect" | undefined;
  collect?: {
    item:
      | SimpleCollectOpenActionSettings
      | MultirecipientFeeCollectOpenActionSettings
      | undefined;
    stats: number | undefined;
    id: string;
  };
  follower?: Profile | undefined;
}

const initialFollowCollectState: FollowCollectState = {
  type: undefined,
};

export const followCollectSlice = createSlice({
  name: "followCollect",
  initialState: initialFollowCollectState,
  reducers: {
    setFollowCollect: (
      state: FollowCollectState,
      { payload: { actionType, actionCollect, actionFollower } }
    ) => {
      state.type = actionType;
      state.collect = actionCollect;
      state.follower = actionFollower;
    },
  },
});

export const { setFollowCollect } = followCollectSlice.actions;

export default followCollectSlice.reducer;
