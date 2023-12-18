interface Message {
  id: number | null;
  content: string;
  sender_id: string;
  chatroom_id: number;
  created_at: string;
}

interface Contact {
  id: string;
  display_name: string;
}

interface Chatroom {
  id: number;
  name?: string;
  members: Contact[];
}
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
