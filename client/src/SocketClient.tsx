import { io, Socket } from "socket.io-client";
import { Message } from "./features/message/messageSlice";
import { Chatroom } from "./features/chatroom/chatroomSlice";

export interface ServerToClientEvents {
  receive_message: (data: Message) => void;
  global_new_message: (data: Message) => void;
  global_receive_new_chatroom: (data: Chatroom) => void;
  receive_typing: (data: { chatroom_id: string; sender_id: string }) => void;
  receive_new_contact: (data: {
    contact_display_name: string;
    sender_id: string;
    sender_display_name: string;
  }) => void;
}

export interface ClientToServerEvents {
  join_room: (data: string) => void;
  leave_room: (data: string) => void;
  send_message: (data: Message) => void;
  send_new_chatroom: (data: Chatroom) => void;
  send_typing: (data: { chatroom_id: string; sender_id: string }) => void;
  send_new_contact: (data: {
    contact_display_name: string;
    sender_id: string;
    sender_display_name: string;
  }) => void;
}

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  import.meta.env.VITE_SERVER_ORIGIN
);

