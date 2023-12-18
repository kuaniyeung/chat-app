import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { setSelectedChatroom } from "../../../features/chatroom/chatroomSlice";
import { getMessagesByChatroom } from "../../../features/message/messageSlice";
import LoadingSpinner from "../../Reusable/LoadingSpinner";
import ChatForm from "./ChatForm";
import Messages from "./Messages";

const Chat = () => {
  // Global states in Redux
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const selectedChatroom = useAppSelector(
    (state) => state.chatroom.selectedChatroom
  );
  const messages = useAppSelector((state) => state.message.messages);
  const loading = useAppSelector((state) => state.message.loading);

  // Local states
  const [initialFetch, setInitialFetch] = useState(false);

  const fetchMessages = async () => {
    try {
      await dispatch(getMessagesByChatroom()).unwrap();
      setInitialFetch(false);
    } catch (error) {
      console.error(
        "An error occurred while dispatching fetchMessages:",
        error
      );
    }
  };

  const getChatroomName = () => {
    if (selectedChatroom?.name === "")
      return `${selectedChatroom.members
        .filter((member) => member.id !== user.id)
        .map((member) => member.display_name)
        .join(", ")}`;

    return selectedChatroom?.name;
  };

  useEffect(() => {
    setInitialFetch(true);
    fetchMessages();
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full h-full bg-base-100 z-20 p-2">
      <div className="flex flex-col max-h-full h-full justify-between">
        <div className="flex flex-none justify-between">
          {/* Chatroom name */}

          <h1 className="self-center p-3 text-neutral">{getChatroomName()}</h1>

          {/* Close button */}
          <button
            className="btn btn-circle btn-ghost"
            onClick={() => {
              dispatch(setSelectedChatroom(null));
            }}
          >
            <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex flex-col grow overflow-auto h-full">
          {!Object.keys(messages).length && (
            <h1 className="m-4 text-base-300 text-center">
              No messages in this chat
            </h1>
          )}

          {initialFetch && loading ? (
            <div className="fixed h-full w-full flex justify-center items-center">
              <LoadingSpinner size={"lg"} colour={"neutral-content"} />
            </div>
          ) : (
            <Messages />
          )}
        </div>

        {/* Chat form and send button */}
        <ChatForm />
      </div>
    </div>
  );
};

export default Chat;
