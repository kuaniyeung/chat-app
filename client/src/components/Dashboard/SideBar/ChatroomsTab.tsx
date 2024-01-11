import { faPlus, faUser, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MouseEvent, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { setSelectedChatroom } from "../../../features/chatroom/chatroomSlice";
import { removeAlert } from "../../../features/alert/alertSlice";
import { useNavigate } from "react-router-dom";
interface Props {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

const ChatroomsTab: React.FC<Props> = ({ onClick }) => {
  const navigate = useNavigate();

  // Global states in Redux
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const chatrooms = useAppSelector((state) => state.chatroom.chatrooms);
  const contacts = useAppSelector((state) => state.contact.contacts);

  // Local states & refs & variables
  const [isAlerted, setIsAlerted] = useState<number[]>([]);

  useEffect(() => {
    const alertedChatroomIds = chatrooms
      .filter((chatroom) => chatroom.alerted)
      .map((chatroom) => chatroom.id);

    setIsAlerted(alertedChatroomIds);
  }, [chatrooms]);

  return (
    <>
      <h1 className="relative text-center p-3 uppercase text-sm italic text-primary bg-base-200 flex justify-center items-center">
        <span>Your Chatrooms</span>

        <button
          className="absolute btn btn-sm btn-primary px-2 right-2"
          onClick={onClick}
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </h1>

      {/* If no chatrooms added: */}
      {!Object.keys(chatrooms).length && (
        <h1 className="m-4 text-base-300 text-center">No Saved Chatrooms</h1>
      )}

      {/* List out existing chatrooms: */}
      {chatrooms
        .toSorted((a, b) => {
          const createdAtA = new Date(a.lastMessage?.created_at || 0);
          const createdAtB = new Date(b.lastMessage?.created_at || 0);

          return createdAtB.getTime() - createdAtA.getTime();
        })
        .map((chatroom) => {
          let chatroomName;
          let senderDisplay;
          let empty = false;
          const twoPeopleChat = chatroom.members.length === 2;

          if (chatroom.name === "")
            chatroomName = `${chatroom.members
              .filter((member) => member.id !== user.id)
              .map((member) => member.display_name)
              .join(", ")}`;

          if (chatroom.name !== "") chatroomName = chatroom.name;

          if (chatroom.lastMessage.created_at) {
            if (chatroom.lastMessage.sender_display_name === user.display_name)
              senderDisplay = "You";
            else if (
              !chatroom.lastMessage.sender_display_name &&
              !chatroom.lastMessage.content
            )
              empty = true;
            else if (chatroom.lastMessage.sender_display_name === null)
              senderDisplay = "Deleted User";
            else if (
              contacts.some(
                (contact) =>
                  contact.display_name ===
                  chatroom.lastMessage.sender_display_name
              )
            )
              senderDisplay = chatroom.lastMessage.sender_display_name;
            else senderDisplay = "Unknown User";
          }

          return (
            <div
              key={chatroom.id}
              // className={`block cursor-pointer my-5 mx-4 px-2 flex items-center border-l-4 border-transparent ${
              //   chatroom.alerted ? `!border-l-accent` : ``
              // }}`}
              className={`block cursor-pointer my-5 mx-4 px-2 flex items-center border-l-4 border-transparent ${
                isAlerted.includes(chatroom.id) ? "border-l-accent" : ""
              }`}
              onClick={() => {
                navigate(`/chatrooms/${chatroom.id}`);
                dispatch(setSelectedChatroom(chatroom));
                dispatch(removeAlert({ chatroom_id: chatroom.id }));
              }}
            >
              {/* Chatroom Icon */}

              <div className="p-2 mr-3 bg-base-200 rounded-xl">
                <FontAwesomeIcon
                  icon={twoPeopleChat ? faUser : faUserGroup}
                  className="w-5 h-5 text-neutral"
                />
              </div>

              <div>
                {/* Chatroom Name */}
                <a className="text-neutral">{chatroomName}</a>

                {/* Chatroom Last Message */}
                {!empty ? (
                  <p className="text-base-300 font-light text-sm mt-1">
                    <span>{senderDisplay}: </span>

                    {chatroom.lastMessage.content}
                  </p>
                ) : (
                  <p className="text-base-300 font-light text-sm mt-1">
                    No messages yet
                  </p>
                )}
              </div>
            </div>
          );
        })}
    </>
  );
};

export default ChatroomsTab;
