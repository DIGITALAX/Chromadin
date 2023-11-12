import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PaginatedState {
  value: string | undefined;
}

const initialPaginatedState: PaginatedState = {
  value: undefined,
};

export const paginatedSlice = createSlice({
  name: "paginated",
  initialState: initialPaginatedState,
  reducers: {
    setPaginated: (state: PaginatedState, action: PayloadAction<any>) => {
      state.value = action.payload;
    },
  },
});

export const { setPaginated } = paginatedSlice.actions;

export default paginatedSlice.reducer;
