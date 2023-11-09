import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "../../SupabasePlugin";
import { Session } from "@supabase/supabase-js";

type User = {
  id?: string;
  display_name?: string;
  email?: string;
  created_at?: string;
};

type InitialState = {
  loading: boolean;
  user: User;
  error: string;
};

interface SignInUserPayload {
  email: string;
  password: string;
}

interface CreateUserPayload extends SignInUserPayload {
  displayName: string;
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

      if (data.user) {
        const user = data.user;

        const { error: userError } = await supabase
          .from("users")
          .upsert([
            {
              id: user.id,
              email: payload.email,
              display_name: payload.displayName,
            },
          ])
          .select();

        if (userError) {
          const customError = {
            message: userError.details,
          };

          return rejectWithValue(customError);
        }
      }
      const newData = { ...data, display_name: payload.displayName };

      return newData;
    } catch (error) {
      return rejectWithValue(error as Error);
    }
  }
);

export const signInUser = createAsyncThunk(
  "user/signInUser",
  async (payload: SignInUserPayload, { rejectWithValue }) => {
    try {
      const { data } = await supabase.auth.signInWithPassword({
        email: payload.email,
        password: payload.password,
      });

      return data;
    } catch (error) {
      return rejectWithValue(error as Error);
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
        action: PayloadAction<{
          display_name: string;
          user: User | null;
          session: Session | null;
        }>
      ) => {
        (state.loading = false),
          (state.user.id = action.payload.user?.id),
          (state.user.display_name = action.payload.display_name),
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
