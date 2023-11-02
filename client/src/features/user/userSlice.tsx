import { createSlice } from "@reduxjs/toolkit";
import { addUser } from "../../SupabasePlugin";
import type { PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string,
  email: string;
  password: string;
  created_at: string
}

const initialState = [
  {
    email: "myemail@email.com",
    password: "XYZ",
  },
  {
    email: "myotheremail@email.com",
    password: "XYZABC",
  },
];

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    createUser: {
      reducer: (state, action: PayloadAction<User>) => {
        state.push(action.payload);
      },
      prepare: (
        id: string,
        email: string,
        password: string,
        created_at: string
      ) => {
        return {
          payload: {
            id,
            email,
            password,
            created_at,
          },
        };
      },
    },
  },
});

export const { createUser } = userSlice.actions;

export default userSlice.reducer;
