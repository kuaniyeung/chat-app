import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Session } from "@supabase/supabase-js";
import { createUser, signInUser, signOutUser } from "../user/userSlice";
import { supabase } from "../../SupabasePlugin";

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

export const getSession = createAsyncThunk("session/getSession", async () => {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) throw error;

    return session;
  } catch (error) {
    return error;
  }
});

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    retrieveSessionData: (state, action: PayloadAction<Session | null>) => {
      (state.loading = false),
        (state.session = action.payload),
        (state.error = "");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getSession.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      getSession.fulfilled,
      (state, action) => {
      (state.loading = false),
        (state.session = action.payload as Session | null),
        (state.error = "");
      }
    );
    builder.addCase(getSession.rejected, (state, action) => {
      (state.loading = false),
        (state.session = null),
        (state.error = action.error.message || "Something went wrong");
    });
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
    builder.addCase(signOutUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(signOutUser.fulfilled, (state) => {
      state.loading = false;
      state.session = null;
      state.error = "";
    });
    builder.addCase(signOutUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Something went wrong";
    });
  },
});

export default sessionSlice.reducer;
export const { retrieveSessionData } = sessionSlice.actions;
