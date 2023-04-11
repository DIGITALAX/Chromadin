import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ProductTypeState {
  value: string;
}

const initialProductTypeState: ProductTypeState = {
  value: "ropa",
};

export const producttypeSlice = createSlice({
  name: "producttype",
  initialState: initialProductTypeState,
  reducers: {
    setProductType: (state: ProductTypeState, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const { setProductType } = producttypeSlice.actions;

export default producttypeSlice.reducer;
