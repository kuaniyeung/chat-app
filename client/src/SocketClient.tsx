import { io, Socket } from "socket.io-client";
import { Message } from "./features/message/messageSlice";

export interface ServerToClientEvents {
  receive_message: (data: Message) => void;
  receive_typing: (data: { chatroom_id: string; sender_id: string }) => void;
}

export interface ClientToServerEvents {
  join_room: (data: string) => void;
  leave_room: (data: string) => void;
  send_message: (data: Message) => void;
  send_typing: (data: { chatroom_id: string; sender_id: string }) => void;
}

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  import.meta.env.VITE_SERVER_ORIGIN
);

