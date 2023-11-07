import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface GraphState {
  value: any[];
}

const initialGraphState: GraphState = {
  value: [],
};

export const graphSlice = createSlice({
  name: "graph",
  initialState: initialGraphState,
  reducers: {
    setGraphRedux: (state: GraphState, action: PayloadAction<any[]>) => {
      state.value = action.payload;
    },
  },
});

export const { setGraphRedux } = graphSlice.actions;

export default graphSlice.reducer;
