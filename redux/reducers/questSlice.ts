import { Quest } from "@/components/Common/Video/types/controls.types";
import { Post } from "@/components/Home/types/generated";
import { createSlice } from "@reduxjs/toolkit";

export interface QuestState {
  open: boolean;
  video: Post | undefined;
}
const initialQuestState: QuestState = {
  open: false,
  video: undefined,
};

export const questSlice = createSlice({
  name: "quest",
  initialState: initialQuestState,
  reducers: {
    setQuestRedux: (
      state: QuestState,
      { payload: { actionOpen, actionVideo } }
    ) => {
      state.open = actionOpen;
      state.video = actionVideo;
    },
  },
});

export const { setQuestRedux } = questSlice.actions;

export default questSlice.reducer;
