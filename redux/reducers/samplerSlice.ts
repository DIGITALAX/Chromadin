import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SamplerState {
  values: {
    pies: any[];
    graphs: {
      name: string;
      data: any;
    }[];
    stats: any[][];
    rates: number[];
  };
}

const initialSamplerState: SamplerState = {
  values: {
    pies: [],
    graphs: [],
    stats: [],
    rates: [],
  },
};

export const samplerSlice = createSlice({
  name: "sampler",
  initialState: initialSamplerState,
  reducers: {
    setSamplerRedux: (
      state: SamplerState,
      action: PayloadAction<{
        pies: any[];
        graphs: {
          name: string;
          data: any;
        }[];
        stats: any[][];
        rates: number[];
      }>
    ) => {
      state.values = action.payload;
    },
  },
});

export const { setSamplerRedux } = samplerSlice.actions;

export default samplerSlice.reducer;
