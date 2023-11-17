import { useAppDispatch, useAppSelector } from "../../../app/hooks";

const ChatroomsTab = () => {
  const chatrooms = useAppSelector((state) => state.chatroom.chatrooms);

  if (!chatrooms) return <h1>No Saved Chatrooms</h1>;
};

export default ChatroomsTab;
