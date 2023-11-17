import { createSlice } from "@reduxjs/toolkit";

export type Contact = {
  user_id: number;
  user_email: string;
  display_name: string;
};

type InitialState = {
  isSelected: boolean;
  loading: boolean;
  contacts: Contact | null;
  error: string;
};

const initialState: InitialState = {
  isSelected: false,
  loading: false,
  contacts: null,
  error: "",
};

export const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {
    setContactActive: (state, action) => {
      state.isSelected = action.payload;
    },
  },
});

export default contactSlice.reducer;
export const {setContactActive} = contactSlice.actions
