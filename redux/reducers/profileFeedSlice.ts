import { Mirror, Post, Quote } from "@/components/Home/types/generated";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ProfileFeedState {
  value: (Post | Quote | Mirror)[];
}

const initialProfileFeedState: ProfileFeedState = {
  value: [],
};

export const profileFeedSlice = createSlice({
  name: "profileFeed",
  initialState: initialProfileFeedState,
  reducers: {
    setProfileFeedRedux: (
      state: ProfileFeedState,
      action: PayloadAction<(Post | Quote | Mirror)[]>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setProfileFeedRedux } = profileFeedSlice.actions;

export default profileFeedSlice.reducer;
