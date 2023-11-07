import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ProfileScrollPosState {
  value: number;
}

const initialProfileScrollPosState: ProfileScrollPosState = {
  value: 0,
};

export const profileScrollPosSlice = createSlice({
  name: "profileScrollPos",
  initialState: initialProfileScrollPosState,
  reducers: {
    setProfileScrollPosRedux: (state: ProfileScrollPosState, action: PayloadAction<number>) => {
      state.value = action.payload;
    },
  },
});

export const { setProfileScrollPosRedux } = profileScrollPosSlice.actions;

export default profileScrollPosSlice.reducer;
