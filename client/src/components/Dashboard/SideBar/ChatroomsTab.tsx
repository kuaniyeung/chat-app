import { MouseEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { setSelectedChatroom } from "../../../features/chatroom/chatroomSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faUser, faUserGroup } from "@fortawesome/free-solid-svg-icons";
interface Props {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

const ChatroomsTab: React.FC<Props> = ({ onClick }) => {
  // Global states in Redux
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const chatrooms = useAppSelector((state) => state.chatroom.chatrooms);
  const contacts = useAppSelector((state) => state.contact.contacts);
  const lastMessages = useAppSelector((state) => state.message.lastMessages);

  return (
    <>
      <h1 className="text-center p-3 uppercase text-sm italic text-primary bg-base-200 flex justify-center items-center">
        <span className="">Your Chatrooms</span>

        <button
          className="btn btn-sm btn-primary px-2 fixed right-2"
          onClick={onClick}
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </h1>

      {/* If no chatrooms added: */}
      {!Object.keys(chatrooms).length && <h1 className="m-4 text-base-300 text-center">No Saved Chatrooms</h1>}

      {/* List out existing chatrooms: */}
      {chatrooms.map((chatroom) => {
        let chatroomName;
        let senderDisplay;
        let empty;
        const twoPeopleChat = chatroom.members.length === 2;

        if (chatroom.name === "")
          chatroomName = `You, ${chatroom.members
            .filter((member) => member.id !== user.id)
            .map((member) => member.display_name)
            .join(", ")}`;

        if (chatroom.name !== "") chatroomName = chatroom.name;

        const lastMessage = lastMessages.find(
          (message) => message[0] === chatroom.id
        );

        if (lastMessage) {
          if (lastMessage[1] === user.display_name) senderDisplay = "You";
          else if (lastMessage[1] === null) senderDisplay = "Deleted User";
          else if (
            contacts.some((contact) => contact.display_name === lastMessage[1])
          )
            senderDisplay = "Unknown User";
          else if (!lastMessage[1] && !lastMessage[2]) empty = true;
        }

        return (
          <div
            key={chatroom.id}
            className="block cursor-pointer my-5 mx-6 flex items-center"
            onClick={() => dispatch(setSelectedChatroom(chatroom))}
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
              {lastMessage &&
                (!empty ? (
                  <p className="text-base-300 font-light text-sm mt-1">
                    <span>{senderDisplay}: </span>

                    {lastMessage[2]}
                  </p>
                ) : (
                  <p className="text-base-300 font-light text-sm mt-1">
                    No messages yet
                  </p>
                ))}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default ChatroomsTab;
