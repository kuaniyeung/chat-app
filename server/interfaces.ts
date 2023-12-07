export interface Message {
  id: number | null;
  content: string;
  sender_id: string;
  chatroom_id: number;
  created_at: string;
}

export interface ServerToClientEvents {
  receive_message: (data: Message) => void;
  receive_typing: (data: {
    chatroom_id: string;
    sender_id: string;
  }) => void;
}

export interface ClientToServerEvents {
  join_room: (data: string) => void;
  leave_room: (data: string) => void;
  send_message: (data: Message) => void;
  send_typing: (data: { chatroom_id: string; sender_id: string }) => void;
}
