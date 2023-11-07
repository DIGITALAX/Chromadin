import { UploadedMedia } from "@/components/Home/types/home.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PublicationImagesState {
  value: UploadedMedia[];
}

const initialPublicationImagesState: PublicationImagesState = {
  value: [],
};

export const publicationImagesSlice = createSlice({
  name: "publicationImages",
  initialState: initialPublicationImagesState,
  reducers: {
    setPublicationImages: (
      state: PublicationImagesState,
      action: PayloadAction<UploadedMedia[]>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setPublicationImages } = publicationImagesSlice.actions;

export default publicationImagesSlice.reducer;
