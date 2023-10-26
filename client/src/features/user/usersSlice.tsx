import { createSlice, nanoid } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { DateTime } from "luxon";

interface User {
  id: string;
  password: string;
  email: string;
  avatar: string;
  created_at: string | null;
}

const initialState = [
  {
    id: "dgPXxUz_6fWIfi8XmiSy",
    password: "XYZ",
    email: "myemail@email.com",
    avatar: "",
    created_at: DateTime.now().toISO(),
  },
  {
    id: "gdfHO_fy58UeoYI5em4vU",
    password: "XYZABC",
    email: "myotheremail@email.com",
    avatar: "",
    created_at: DateTime.now().toISO(),
  },
];

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    createUser: {
      reducer: (state, action: PayloadAction<User>) => {
        state.push(action.payload);
      },
      prepare: (
        password: string,
        email: string,
        avatar: string,
      ) => {
        return {
          payload: {
            id: nanoid(),
            password,
            email,
            avatar,
            created_at: DateTime.now().toISO(),
          },
        };
      },
    },
  },
});

export const { createUser } = usersSlice.actions;

export default usersSlice.reducer;
