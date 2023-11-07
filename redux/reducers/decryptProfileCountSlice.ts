import { createSlice } from "@reduxjs/toolkit";

export interface DecryptProfileFeedCountState {
  like: number[];
  mirror: number[];
  collect: number[];
  comment: number[];
  hasLiked: boolean[];
  hasMirrored: boolean[];
  hasCollected: boolean[];
}

const initialDecryptProfileFeedCountState: DecryptProfileFeedCountState = {
  like: [],
  mirror: [],
  collect: [],
  comment: [],
  hasLiked: [],
  hasMirrored: [],
  hasCollected: [],
};

export const decryptProfileFeedCountSlice = createSlice({
  name: "decryptProfileFeedCount",
  initialState: initialDecryptProfileFeedCountState,
  reducers: {
    setDecryptProfileFeedCount: (
      state: DecryptProfileFeedCountState,
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

export const { setDecryptProfileFeedCount } =
  decryptProfileFeedCountSlice.actions;

export default decryptProfileFeedCountSlice.reducer;
