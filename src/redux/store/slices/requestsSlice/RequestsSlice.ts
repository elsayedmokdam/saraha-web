import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RequestsState {
  /** pending identity requests waiting for my answer */
  pendingCount: number;
}

const initialState: RequestsState = { pendingCount: 0 };

const requestsSlice = createSlice({
  name: "requests",
  initialState,
  reducers: {
    setPendingCount: (state, action: PayloadAction<number>) => {
      state.pendingCount = Math.max(0, action.payload);
    },
    decrementPending: (state) => {
      state.pendingCount = Math.max(0, state.pendingCount - 1);
    },
  },
});

export const { setPendingCount, decrementPending } = requestsSlice.actions;
export default requestsSlice.reducer;
