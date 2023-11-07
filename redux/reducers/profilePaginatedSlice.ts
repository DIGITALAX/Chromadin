import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ProfilePaginatedState {
  value: any;
}

const initialProfilePaginatedState: ProfilePaginatedState = {
  value: {},
};

export const ProfilePaginatedSlice = createSlice({
  name: "ProfilePaginated",
  initialState: initialProfilePaginatedState,
  reducers: {
    setProfilePaginated: (state: ProfilePaginatedState, action: PayloadAction<any>) => {
      state.value = action.payload;
    },
  },
});

export const { setProfilePaginated } = ProfilePaginatedSlice.actions;

export default ProfilePaginatedSlice.reducer;
