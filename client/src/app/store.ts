import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../features/user/userSlice'
import sessionReducer from '../features/session/sessionSlice'
import chatroomReducer from "../features/chatroom/ChatroomSlice"
import contactReducer from "../features/contact/ContactSlice"
import  messageReducer from "../features/message/MessageSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    session: sessionReducer,
    chatroom: chatroomReducer,
    contact: contactReducer,
    message: messageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch