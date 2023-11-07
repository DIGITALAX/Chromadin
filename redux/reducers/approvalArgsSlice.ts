import { ApprovalArgs } from "@/components/Home/types/home.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ApprovalArgsState {
  args?: ApprovalArgs;
}

const initialCollectValueState: ApprovalArgsState = {};

export const approvalArgsSlice = createSlice({
  name: "approvalArgs",
  initialState: initialCollectValueState,
  reducers: {
    setApprovalArgs: (
      state: ApprovalArgsState,
      action: PayloadAction<ApprovalArgs>
    ) => {
      state.args = action.payload;
    },
  },
});

export const { setApprovalArgs } = approvalArgsSlice.actions;

export default approvalArgsSlice.reducer;
