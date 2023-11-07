import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FulfillmentDetailsState {
  value: {
    name: string;
    contact: string;
    address: string;
    zip: string;
    city: string;
    state: string;
    country: string;
  };
}

const initialFulfillmentDetailsState: FulfillmentDetailsState = {
  value: {
    name: "",
    contact: "",
    address: "",
    zip: "",
    city: "",
    state: "",
    country: "",
  },
};

export const fulfillmentDetailsSlice = createSlice({
  name: "fulfillmentDetails",
  initialState: initialFulfillmentDetailsState,
  reducers: {
    setFulfillmentDetails: (
      state: FulfillmentDetailsState,
      action: PayloadAction<{
        name: string;
        contact: string;
        address: string;
        zip: string;
        city: string;
        state: string;
        country: string;
      }>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setFulfillmentDetails } = fulfillmentDetailsSlice.actions;

export default fulfillmentDetailsSlice.reducer;
