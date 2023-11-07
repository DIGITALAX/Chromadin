import { Post } from "@/components/Home/types/generated";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface DecryptProfileFeedState {
  value: Post[];
}

const initialDecryptProfileFeedState: DecryptProfileFeedState = {
  value: [],
};

export const decryptProfileFeedSlice = createSlice({
  name: "decryptProfileFeed",
  initialState: initialDecryptProfileFeedState,
  reducers: {
    setDecryptProfileFeedRedux: (
      state: DecryptProfileFeedState,
      action: PayloadAction<Post[]>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setDecryptProfileFeedRedux } = decryptProfileFeedSlice.actions;

export default decryptProfileFeedSlice.reducer;
