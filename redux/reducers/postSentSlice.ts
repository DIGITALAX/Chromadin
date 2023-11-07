import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PostSentState {
  value: boolean;
}

const initialPostSentState: PostSentState = {
  value: false,
};

export const postSentSlice = createSlice({
  name: "postSent",
  initialState: initialPostSentState,
  reducers: {
    setPostSent: (state: PostSentState, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

export const { setPostSent } = postSentSlice.actions;

export default postSentSlice.reducer;
