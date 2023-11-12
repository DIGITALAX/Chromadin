import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Details {
  name: string;
  contact: string;
  address: string;
  zip: string;
  city: string;
  state: string;
  country: string;
}

export interface FulfillmentDetailsState {
  value: Details;
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
      action: PayloadAction<Details>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setFulfillmentDetails } = fulfillmentDetailsSlice.actions;

export default fulfillmentDetailsSlice.reducer;
