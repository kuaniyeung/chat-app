import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction, SerializedError } from "@reduxjs/toolkit";
import { supabase } from "../../SupabasePlugin";
import { Session } from "@supabase/supabase-js";

export interface User {
  id?: string;
  display_name?: string;
  email?: string;
  created_at?: string;
};

interface InitialState {
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
}

const initialState: InitialState = {
  loading: false,
  user: {},
  error: "",
};

export const createUser = createAsyncThunk(
  "user/createUser",
  async (payload: CreateUserPayload, { rejectWithValue }) => {
    // Check if display_name already exists in Database
    try {
      const { data: existingDisplayNames, error } = await supabase
        .from("users")
        .select("display_name");

      if (error) throw error;

      const displayNameExists = existingDisplayNames.some(
        (user) => user.display_name === payload.displayName
      );

      if (displayNameExists)
        throw new Error(
          "Display name already taken. \nPlease choose a different user name."
        );
    } catch (error) {
      return rejectWithValue(error as Error);
    }

    // Adding new user to Auth
    try {
      const { data, error } = await supabase.auth.signUp({
        email: payload.email,
        password: payload.password,
        options: {
          data: {
            display_name: payload.displayName,
          },
        },
      });

      if (error) throw error;

      if (data?.user) {
        const user = data.user;

        // Adding new user to "users" table
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

        if (userError) throw userError;
      }

      // If execution reaches here, return the data
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email: payload.email,
        password: payload.password,
      });

      if (error) throw error;

      return data;
    } catch (error) {
      return rejectWithValue(error as Error);
    }
  }
);

export const signOutUser = createAsyncThunk("user/signOutUser", async () => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;
  } catch (error) {
    return error;
  }
});

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    retrieveUserData: (state, action: PayloadAction<User>) => {
      (state.loading = false),
        (state.user = action.payload),
        (state.error = "");
    },
  },
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
    builder.addCase(
      createUser.rejected,
      (
        state,
        action: PayloadAction<
          unknown,
          string,
          {
            arg: CreateUserPayload;
            requestId: string;
            requestStatus: "rejected";
            aborted: boolean;
            condition: boolean;
          } & (
            | { rejectedWithValue: true }
            | ({ rejectedWithValue: false } & {})
          ),
          SerializedError
        >
      ) => {
        state.loading = false;
        state.user = {};
        state.error =
          (action.payload as { message?: string })?.message ||
          "Something went wrong";
      }
    );
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
    builder.addCase(
      signInUser.rejected,
      (
        state,
        action: PayloadAction<
          unknown,
          string,
          {
            arg: SignInUserPayload;
            requestId: string;
            requestStatus: "rejected";
            aborted: boolean;
            condition: boolean;
          } & (
            | { rejectedWithValue: true }
            | ({ rejectedWithValue: false } & {})
          ),
          SerializedError
        >
      ) => {
        state.loading = false;
        state.user = {};
        state.error =
          (action.payload as { message?: string })?.message ||
          "Something went wrong";
      }
    );
    builder.addCase(signOutUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(signOutUser.fulfilled, (state) => {
      state.loading = false;
      state.user = {};
      state.error = "";
    });
    builder.addCase(signOutUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Something went wrong";
    });
  },
});

export default userSlice.reducer;
export const { retrieveUserData } = userSlice.actions;
