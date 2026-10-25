import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/services/types/user_interface";

interface UserState {
  profile: User | null;
}

const initialState: UserState = { profile: null };

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<User | null>) => {
      state.profile = action.payload;
    },
    clearProfile: (state) => {
      state.profile = null;
    },
  },
});

export const { setProfile, clearProfile } = userSlice.actions;
export default userSlice.reducer;
