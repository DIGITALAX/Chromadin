import { Profile } from "@/components/Home/types/generated";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface NftScreenState {
  value: boolean;
}

const initialNftScreenState: NftScreenState = {
  value: true,
};

export const nftScreenSlice = createSlice({
  name: "nftScreen",
  initialState: initialNftScreenState,
  reducers: {
    setNftScreen: (state: NftScreenState, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

export const { setNftScreen } = nftScreenSlice.actions;

export default nftScreenSlice.reducer;
