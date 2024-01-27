import { History } from "@/components/Common/Interactions/types/interactions.types";
import { createSlice } from "@reduxjs/toolkit";

export interface HistoryDataState {
  hasMoreBuyerHistory: boolean;
  hasMoreAllHistory: boolean;
  buyerHistory: History[];
  allHistory: History[];
  buyerSkip: number;
  allSkip: number;
}

const initialHistoryDataState: HistoryDataState = {
  buyerHistory: [],
  allHistory: [],
  hasMoreBuyerHistory: true,
  hasMoreAllHistory: true,
  buyerSkip: 0,
  allSkip: 0,
};

export const historyDataSlice = createSlice({
  name: "historyData",
  initialState: initialHistoryDataState,
  reducers: {
    setHistoryDataRedux: (
      state: HistoryDataState,
      {
        payload: {
          actionBuyerHistory,
          actionAllHistory,
          actionHasMoreBuyerHistory,
          actionHasMoreHistory,
          actionAllSkip,
          actionBuyerSkip,
        },
      }
    ) => {
      state.buyerHistory = actionBuyerHistory;
      state.allHistory = actionAllHistory;
      state.hasMoreAllHistory = actionHasMoreHistory;
      state.hasMoreBuyerHistory = actionHasMoreBuyerHistory;
      state.buyerSkip = actionBuyerSkip;
      state.allSkip = actionAllSkip;
    },
  },
});

export const { setHistoryDataRedux } = historyDataSlice.actions;

export default historyDataSlice.reducer;
