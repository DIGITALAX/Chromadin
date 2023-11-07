import { Collection } from "@/components/Home/types/home.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PiesState {
  value: any[];
}

const initialPiesState: PiesState = {
  value: [],
};

export const piesSlice = createSlice({
  name: "pies",
  initialState: initialPiesState,
  reducers: {
    setPiesRedux: (state: PiesState, action: PayloadAction<any[]>) => {
      state.value = action.payload;
    },
  },
});

export const { setPiesRedux } = piesSlice.actions;

export default piesSlice.reducer;
