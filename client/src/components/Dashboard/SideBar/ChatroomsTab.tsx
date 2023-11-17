import { useAppDispatch, useAppSelector } from "../../../app/hooks";

const ChatroomsTab = () => {
  const chatrooms = useAppSelector((state) => state.chatroom.chatrooms);

  return (
    <>
      <h1>Your Chatrooms</h1>
      {!chatrooms && <h1>No Saved Chatrooms</h1>}
      <button className="btn btn-primary">Add New Chatrooms</button>
    </>
  );
};

export default ChatroomsTab;
