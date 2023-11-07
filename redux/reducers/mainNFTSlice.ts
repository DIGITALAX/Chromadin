import { MainNFT, PreRoll } from "@/components/Common/NFT/types/nft.types";
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
    setMainNFT: (
      state: MainNFTState,
      action: PayloadAction<{
        name: string;
        media: string;
        audio?: string;
        coinOp?: PreRoll;
        description: string;
        drop: {
          name: string;
          image: string;
        };
        type: string;
        creator: {
          media: string;
          name: string;
        };
        price: string[];
        acceptedTokens: string[];
        amount: string;
        tokenIds: string[];
        tokensSold: string[] | null;
        blockNumber: string;
        hasAudio: boolean;
      }>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setMainNFT } = mainNFTSlice.actions;

export default mainNFTSlice.reducer;
