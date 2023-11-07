import { createSlice } from "@reduxjs/toolkit";

export interface DecryptFeedCountState {
  like: number[];
  mirror: number[];
  collect: number[];
  comment: number[];
  hasLiked: boolean[];
  hasMirrored: boolean[];
  hasCollected: boolean[];
}

const initialDecryptFeedCountState: DecryptFeedCountState = {
  like: [],
  mirror: [],
  collect: [],
  comment: [],
  hasLiked: [],
  hasMirrored: [],
  hasCollected: [],
};

export const decryptFeedCountSlice = createSlice({
  name: "decryptFeedCount",
  initialState: initialDecryptFeedCountState,
  reducers: {
    setDecryptFeedCount: (
      state: DecryptFeedCountState,
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

export const { setDecryptFeedCount } = decryptFeedCountSlice.actions;

export default decryptFeedCountSlice.reducer;
