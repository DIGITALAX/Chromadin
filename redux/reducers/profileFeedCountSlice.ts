import { createSlice } from "@reduxjs/toolkit";

export interface ProfileFeedCountState {
  like: number[];
  mirror: number[];
  collect: number[];
  comment: number[];
  hasLiked: boolean[];
  hasMirrored: boolean[];
  hasCollected: boolean[];
}

const initialProfileFeedCountState: ProfileFeedCountState = {
  like: [],
  mirror: [],
  collect: [],
  comment: [],
  hasLiked: [],
  hasMirrored: [],
  hasCollected: [],
};

export const profileFeedCountSlice = createSlice({
  name: "profileFeedCount",
  initialState: initialProfileFeedCountState,
  reducers: {
    setProfileFeedCount: (
      state: ProfileFeedCountState,
      {
        payload: {
          actionLike,
          actionMirror,
          actionCollect,
          actionComment,
          actionHasLiked,
          actionHasCollected,
          actionHasMirrored,
        },
      }
    ) => {
      state.like = actionLike;
      state.mirror = actionMirror;
      state.collect = actionCollect;
      state.comment = actionComment;
      state.hasLiked = actionHasLiked;
      state.hasMirrored = actionHasMirrored;
      state.hasCollected = actionHasCollected;
    },
  },
});

export const { setProfileFeedCount } = profileFeedCountSlice.actions;

export default profileFeedCountSlice.reducer;
