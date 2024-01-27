import { MainNFT } from "@/components/Common/NFT/types/nft.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MainNFTState {
  value?: MainNFT;
}

const initialMainNFTState: MainNFTState = {
  value: undefined,
};

export const mainNFTSlice = createSlice({
  name: "mainNFT",
  initialState: initialMainNFTState,
  reducers: {
    setMainNFT: (state: MainNFTState, action: PayloadAction<MainNFT>) => {
      state.value = action.payload;
    },
  },
});

export const { setMainNFT } = mainNFTSlice.actions;

export default mainNFTSlice.reducer;
