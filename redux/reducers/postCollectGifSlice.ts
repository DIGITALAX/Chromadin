import { SimpleCollectOpenActionModuleInput } from "@/components/Home/types/generated";
import {UploadedMedia } from "@/components/Home/types/home.types";
import { createSlice } from "@reduxjs/toolkit";

export interface PostCollectGifState {
  type?: string;
  id?: string;
  collectTypes?: {
    [key: string]: SimpleCollectOpenActionModuleInput | undefined;
  };
  media?: { [key: string]: UploadedMedia[] };
}

const initialPostCollectGifState: PostCollectGifState = {
  collectTypes: {},
  media: {},
};

export const postCollectGifSlice = createSlice({
  name: "postCollectGif",
  initialState: initialPostCollectGifState,
  reducers: {
    setPostCollectGif: (
      state: PostCollectGifState,
      { payload: { actionType, actionId, actionCollectTypes, actionMedia } }
    ) => {
      state.type = actionType;
      state.id = actionId;
      state.collectTypes = actionCollectTypes;
      state.media = actionMedia;
    },
  },
});

export const { setPostCollectGif } = postCollectGifSlice.actions;

export default postCollectGifSlice.reducer;
