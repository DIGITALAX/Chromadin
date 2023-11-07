import { Post } from "@/components/Home/types/generated";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface DecryptFeedState {
  value: Post[];
}

const initialDecryptFeedState: DecryptFeedState = {
  value: [],
};

export const decryptFeedSlice = createSlice({
  name: "decryptFeed",
  initialState: initialDecryptFeedState,
  reducers: {
    setDecryptFeedRedux: (
      state: DecryptFeedState,
      action: PayloadAction<Post[]>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setDecryptFeedRedux } = decryptFeedSlice.actions;

export default decryptFeedSlice.reducer;
