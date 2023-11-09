import { createSlice } from "@reduxjs/toolkit";

type Contact = {
  user_id: number;
  display_name: string;
};

type InitialState = {
  loading: boolean;
  contacts: Contact | null;
  error: string;
};

const initialState: InitialState = {
  loading: false,
  contacts: null,
  error: "",
};

export const contactSlice = createSlice({
  name: "session",
  initialState,
  reducers: {},
});

export default contactSlice.reducer;
