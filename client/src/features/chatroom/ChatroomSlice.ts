import { createSlice } from "@reduxjs/toolkit";
import { Contact } from "../contact/ContactSlice";

type Chatroom = {
  id: number;
  name: string;
  members: Contact[];
};

type InitialState = {
  isSelected: boolean;
  loading: boolean;
  chatrooms: Chatroom | null;
  error: string;
};

const initialState: InitialState = {
  isSelected: true,
  loading: false,
  chatrooms: null,
  error: "",
};

export const chatroomSlice = createSlice({
  name: "chatroom",
  initialState,
  reducers: {
    setChatroomTabSelected: (state, action) => {
      state.isSelected = action.payload;
    },
  },
});

export default chatroomSlice.reducer;
export const { setChatroomTabSelected } = chatroomSlice.actions;
