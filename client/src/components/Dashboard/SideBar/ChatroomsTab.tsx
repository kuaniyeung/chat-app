import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { MouseEvent } from "react";

interface Props {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

const ChatroomsTab:React.FC<Props> = ({onClick}) => {
  const chatrooms = useAppSelector((state) => state.chatroom.chatrooms);

  return (
    <>
      <h1>Your Chatrooms</h1>
      {!chatrooms && <h1>No Saved Chatrooms</h1>}
      <button className="btn btn-primary" onClick={onClick}>
        Start New Chatrooms
      </button>
    </>
  );
};

export default ChatroomsTab;
