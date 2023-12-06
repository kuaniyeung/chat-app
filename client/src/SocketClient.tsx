import { io, Socket } from "socket.io-client";
import { Message } from "./features/message/messageSlice";

interface ServerToClientEvents {
  receive_message: (data: Message) => void;
}

interface ClientToServerEvents {
  join_room: (data: string) => void;
  leave_room: (data: string) => void;
  send_message: (data: Message) => void;
}

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  import.meta.env.VITE_SERVER_ORIGIN
);

