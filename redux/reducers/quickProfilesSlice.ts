import { QuickProfilesInterface } from "@/components/Common/Wavs/types/wavs.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface QuickProfilesState {
  value: QuickProfilesInterface[];
}

const initialQuickProfilesState: QuickProfilesState = {
  value: [],
};

export const quickProfilesSlice = createSlice({
  name: "quickProfiles",
  initialState: initialQuickProfilesState,
  reducers: {
    setQuickProfilesRedux: (
      state: QuickProfilesState,
      action: PayloadAction<QuickProfilesInterface[]>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setQuickProfilesRedux } = quickProfilesSlice.actions;

export default quickProfilesSlice.reducer;
