import { createSlice } from "@reduxjs/toolkit";
import { Chatroom } from "../chatroom/chatroomSlice";
import { Contact } from "../contact/contactSlice";
import { Message } from "../message/messageSlice";

interface Alert {
  id: number;
  type: string;
  data: {
    newContact: Contact | null;
    newMessage: { chatroom: Chatroom; message: Message } | null;
  };
}

interface InitialState {
  alerts: Alert[];
}

const initialState: InitialState = {
  alerts: [],
};

export const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    setNewAlert: (state, action) => {
      state.alerts = [...state.alerts, action.payload];
    },
    removeAlert: (state, action) => {
      const {alert_id, chatroom_id} = action.payload

      if (alert_id) 
{      const chatroom = state.alerts.find(alert => alert.id === alert_id)?.data.newMessage?.chatroom
      state.alerts = state.alerts.filter(
        (alert) => alert.data.newMessage?.chatroom !== chatroom
      );}

      if (chatroom_id) {
        state.alerts = state.alerts.filter(
          (alert) => alert.data.newMessage?.chatroom.id !== chatroom_id
        );
      }
    },
  },
});

export default alertSlice.reducer;
export const { setNewAlert, removeAlert } = alertSlice.actions;
