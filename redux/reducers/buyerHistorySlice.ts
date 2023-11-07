import { History } from "@/components/Common/Interactions/types/interactions.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface BuyerHistoryState {
  value: History[];
}

const initialBuyerHistoryState: BuyerHistoryState = {
  value: [],
};

export const buyerHistorySlice = createSlice({
  name: "buyerHistory",
  initialState: initialBuyerHistoryState,
  reducers: {
    setBuyerHistoryRedux: (
      state: BuyerHistoryState,
      action: PayloadAction<History[]>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setBuyerHistoryRedux } = buyerHistorySlice.actions;

export default buyerHistorySlice.reducer;
