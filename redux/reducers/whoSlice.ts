import { createSlice } from "@reduxjs/toolkit";

export interface WhoState {
  open: boolean;
  type?: string;
  value?: any;
}

const initialWhoState: WhoState = {
  open: false,
  type: undefined,
  value: undefined,
};

export const whoSlice = createSlice({
  name: "who",
  initialState: initialWhoState,
  reducers: {
    setWho: (
      state: WhoState,
      {
        payload: {
          actionOpen,
          actionType,
          actionValue,
        },
      }
    ) => {
      state.open = actionOpen;
      state.type = actionType;
      state.value = actionValue;
    },
  },
});

export const { setWho } = whoSlice.actions;

export default whoSlice.reducer;
