import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface QuestSuccessState {
  open: boolean;
  image: string;
}

const initialQuestSuccessState: QuestSuccessState = {
  open: false,
  image: "",
};

export const questSuccessSlice = createSlice({
  name: "questSuccess",
  initialState: initialQuestSuccessState,
  reducers: {
    setQuestSuccess: (state: QuestSuccessState, { payload: { actionOpen, actionImage } }) => {
      state.open = actionOpen;
      state.image = actionImage;
    },
  },
});

export const { setQuestSuccess } = questSuccessSlice.actions;

export default questSuccessSlice.reducer;
