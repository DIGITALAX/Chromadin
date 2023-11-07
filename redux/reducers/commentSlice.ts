import { Comment } from "@/components/Home/types/generated";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CommentsState {
  value: Comment[];
}

const initialCommentsState: CommentsState = {
  value: [],
};

export const commentsSlice = createSlice({
  name: "comments",
  initialState: initialCommentsState,
  reducers: {
    setCommentsRedux: (
      state: CommentsState,
      action: PayloadAction<Comment[]>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setCommentsRedux } = commentsSlice.actions;

export default commentsSlice.reducer;
