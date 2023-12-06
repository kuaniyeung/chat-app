import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { setSelectedChatroom } from "../../../features/chatroom/chatroomSlice";
import { MouseEvent } from "react";
interface Props {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

const ChatroomsTab: React.FC<Props> = ({ onClick }) => {
  const dispatch = useAppDispatch();
  const chatrooms = useAppSelector((state) => state.chatroom.chatrooms);
  const user = useAppSelector((state) => state.user.user);

  return (
    <>
      <h1>Your Chatrooms</h1>

      {/* If no chatrooms added: */}
      {!Object.keys(chatrooms).length && <h1>No Saved Chatrooms</h1>}

      {/* List out existing chatrooms: */}
      {chatrooms.map((chatroom) => {
        let content;

        if (chatroom.name === "")
          content = `You, ${chatroom.members
            .filter((member) => member.id !== user.id)
            .map((member) => member.display_name)
            .join(", ")}`;

        if (chatroom.name !== "") content = chatroom.name;

        return (
          <div
            key={chatroom.id}
            className="block cursor-pointer"
            onClick={() => dispatch(setSelectedChatroom(chatroom))}
          >
            <a>{content}</a>
          </div>
        );
      })}
      <button className="btn btn-primary" onClick={onClick}>
        Start New Chatrooms
      </button>
    </>
  );
};

export default ChatroomsTab;
