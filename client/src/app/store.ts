import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../features/user/userSlice'
import sessionReducer from '../features/session/sessionSlice'
import chatroomReducer from "../features/chatroom/ChatroomSlice"
import contactReducer from "../features/contact/ContactSlice"

export const store = configureStore({ reducer: {
    user: userReducer,
    session: sessionReducer,
    chatroom: chatroomReducer,
    contact: contactReducer
} });

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch