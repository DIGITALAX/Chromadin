import { History } from "@/components/Common/Interactions/types/interactions.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface HistoryState {
  value: History[];
}

const initialHistoryState: HistoryState = {
  value: [],
};

export const historySlice = createSlice({
  name: "history",
  initialState: initialHistoryState,
  reducers: {
    setHistoryRedux: (
      state: HistoryState,
      action: PayloadAction<History[]>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setHistoryRedux } = historySlice.actions;

export default historySlice.reducer;
