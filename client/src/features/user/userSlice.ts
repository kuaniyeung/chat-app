import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "../../SupabasePlugin";
import { Session } from "@supabase/supabase-js";

type User = {
  id?: string;
  email?: string;
  created_at?: string;
};

type InitialState = {
  loading: boolean;
  user: User;
  error: string;
};

type CreateUserPayload = {
  email: string;
  password: string;
};

const initialState: InitialState = {
  loading: false,
  user: {},
  error: "",
};

export const createUser = createAsyncThunk(
  "user/createUser",
  async (payload: CreateUserPayload, { rejectWithValue }) => {
    try {
      const { data } = await supabase.auth.signUp({
        email: payload.email,
        password: payload.password,
      });

      return data;
    } catch (error) {
      return rejectWithValue(error as Error); // Handle the error
    }
  }
);

export const signInUser = createAsyncThunk(
  "user/signInUser",
  async (payload: CreateUserPayload, { rejectWithValue }) => {
    try {
      const { data } = await supabase.auth.signInWithPassword({
        email: payload.email,
        password: payload.password,
      });

      return data;
    } catch (error) {
      return rejectWithValue(error as Error); // Handle the error
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      createUser.fulfilled,
      (
        state,
        action: PayloadAction<{ user: User | null; session: Session | null }>
      ) => {
        (state.loading = false),
          (state.user.id = action.payload.user?.id),
          (state.user.email = action.payload.user?.email),
          (state.user.created_at = action.payload.user?.created_at);
        state.error = "";
      }
    );
    builder.addCase(createUser.rejected, (state, action) => {
      (state.loading = false),
        (state.user = {}),
        (state.error = action.error.message || "Something went wrong");
    });
    builder.addCase(signInUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      signInUser.fulfilled,
      (
        state,
        action: PayloadAction<{
          user: User | null;
          session: Session | null;
        }>
      ) => {
        (state.loading = false),
          (state.user.id = action.payload.user?.id),
          (state.user.email = action.payload.user?.email),
          (state.user.created_at = action.payload.user?.created_at);
        state.error = "";
      }
    );
    builder.addCase(signInUser.rejected, (state, action) => {
      (state.loading = false),
        (state.user = {}),
        (state.error = action.error.message || "Something went wrong");
    });
  },
});

export default userSlice.reducer;
