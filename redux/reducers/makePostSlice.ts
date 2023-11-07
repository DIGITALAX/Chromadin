import { Quote, Post, Comment } from "@/components/Home/types/generated";
import { createSlice } from "@reduxjs/toolkit";

export interface MakePostState {
  value: boolean;
  quote: Post | Quote | Comment | undefined;
}

const initialMakePostState: MakePostState = {
  value: false,
  quote: undefined,
};

export const makePostSlice = createSlice({
  name: "makePost",
  initialState: initialMakePostState,
  reducers: {
    setMakePost: (
      state: MakePostState,
      { payload: { actionValue, actionQuote } }
    ) => {
      state.value = actionValue;
      state.quote = actionQuote;
    },
  },
});

export const { setMakePost } = makePostSlice.actions;

export default makePostSlice.reducer;
