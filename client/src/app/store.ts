import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
import sessionReducer from "../features/session/sessionSlice";
import chatroomReducer from "../features/chatroom/chatroomSlice";
import contactReducer from "../features/contact/contactSlice";
import messageReducer from "../features/message/messageSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    session: sessionReducer,
    chatroom: chatroomReducer,
    contact: contactReducer,
    message: messageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
