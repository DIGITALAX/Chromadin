import { Collection, Drop } from "@/components/Home/types/home.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface DropsState {
  value: Drop[];
}

const initialDropsState: DropsState = {
  value: [],
};

export const dropsSlice = createSlice({
  name: "drops",
  initialState: initialDropsState,
  reducers: {
    setDropsRedux: (
      state: DropsState,
      action: PayloadAction<Drop[]>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setDropsRedux } = dropsSlice.actions;

export default dropsSlice.reducer;
