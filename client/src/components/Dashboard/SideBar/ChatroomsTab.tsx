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

      {/* If no chatrooms added: */}
      {!Object.keys(chatrooms).length && <h1>No Saved Chatrooms</h1>}

      {/* List out existing chatrooms: */}
      {chatrooms.map((chatroom) => {
          return (
            <a key={chatroom.id} className="block cursor-pointer">
              {chatroom.name}
            </a>
          );
        })}
      <button className="btn btn-primary" onClick={onClick}>
        Start New Chatrooms
      </button>
    </>
  );
};

export default ChatroomsTab;
