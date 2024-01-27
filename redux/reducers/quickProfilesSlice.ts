import { Profile } from "@/components/Home/types/generated";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface QuickProfilesState {
  value: Profile[];
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
      action: PayloadAction<Profile[]>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setQuickProfilesRedux } = quickProfilesSlice.actions;

export default quickProfilesSlice.reducer;
