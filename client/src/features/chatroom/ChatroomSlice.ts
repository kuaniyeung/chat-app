import { createSlice } from "@reduxjs/toolkit";

type Chatroom = {
    id: number,
    name: string
}

type InitialState = {
  loading: boolean;
  chatrooms: Chatroom | null;
  error: string;
};

const initialState: InitialState = {
  loading: false,
  chatrooms: null,
  error: "",
};

export const chatroomSlice = createSlice({
  name: "session",
  initialState,
  reducers: {},
});

export default chatroomSlice.reducer;
