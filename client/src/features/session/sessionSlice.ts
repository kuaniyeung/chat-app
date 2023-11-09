import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Session } from "@supabase/supabase-js";
import { createUser, signInUser } from "../user/userSlice";

type InitialState = {
  loading: boolean;
  session: Session | null;
  error: string;
};

const initialState: InitialState = {
  loading: false,
  session: null,
  error: "",
};

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      createUser.fulfilled,
      (state, action: PayloadAction<{ session: Session | null }>) => {
        (state.loading = false),
          (state.session = action.payload.session),
          (state.error = "");
      }
    );
    builder.addCase(createUser.rejected, (state, action) => {
      (state.loading = false),
        (state.session = null),
        (state.error = action.error.message || "Something went wrong");
    });
    builder.addCase(signInUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      signInUser.fulfilled,
      (state, action: PayloadAction<{ session: Session | null }>) => {
        (state.loading = false),
          (state.session = action.payload.session),
          (state.error = "");
      }
    );
    builder.addCase(signInUser.rejected, (state, action) => {
      (state.loading = false),
        (state.session = null),
        (state.error = action.error.message || "Something went wrong");
    });
  },
});

export default sessionSlice.reducer;
