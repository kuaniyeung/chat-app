import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { setSelectedChatroom } from "../../../features/chatroom/chatroomSlice";
import { getMessagesByChatroom } from "../../../features/message/messageSlice";
import LoadingSpinner from "../../Reusable/LoadingSpinner";
import ChatForm from "./ChatForm";
import Messages from "./Messages";
import { useNavigate, useParams } from "react-router-dom";
import { useMediaQuery } from "@react-hook/media-query";

const Chat = () => {
  const navigate = useNavigate();
  const { chatroomId } = useParams();
  const selectedChatroomIdFromParams = chatroomId
    ? parseInt(chatroomId, 10)
    : 0;

  // Global states in Redux
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const chatrooms = useAppSelector((state) => state.chatroom.chatrooms);
  const selectedChatroom = useAppSelector(
    (state) => state.chatroom.selectedChatroom
  );
  const messages = useAppSelector((state) => state.message.messages);
  const loading = useAppSelector((state) => state.message.loading);

  // Local states and variables
  const isTablet = useMediaQuery("(min-width: 768px)");
  const [initialFetch, setInitialFetch] = useState(false);
  const selectedChatroomFromParams = chatrooms.find(
    (chatroom) => chatroom.id === selectedChatroomIdFromParams
  );

  const fetchMessages = async () => {
    console.log(selectedChatroom);
    if (selectedChatroomIdFromParams) {
      console.log("trying id from params");
      try {
        await dispatch(
          getMessagesByChatroom({ chatroom_id: selectedChatroomIdFromParams })
        ).unwrap();
        setInitialFetch(false);
      } catch (error) {
        console.error(
          "An error occurred while dispatching fetchMessages:",
          error
        );
      }
    } else if (selectedChatroom?.id) {
      console.log("trying id from redux ");
      try {
        await dispatch(
          getMessagesByChatroom({ chatroom_id: selectedChatroom?.id })
        ).unwrap();
        setInitialFetch(false);
      } catch (error) {
        console.error(
          "An error occurred while dispatching fetchMessages:",
          error
        );
      }
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
    if (selectedChatroomIdFromParams) {
      dispatch(setSelectedChatroom(selectedChatroomFromParams));
    }
  }, [chatroomId, selectedChatroom]);

  return (
    <div className="h-screen flex flex-col max-h-full h-full justify-between md:w-3/5 md:border-l-2 md:border-l-accent">
      <div className="flex flex-none justify-between px-2 bg-base-200 border-b-2 border-b-base-300 drop-shadow-sm">
        {/* Chatroom name */}
        <h1 className="self-center p-3 text-lg text-neutral">
          {getChatroomName()}
        </h1>

        {/* Close button */}
        <button
          className={`btn btn-circle btn-ghost ${isTablet ? "hidden" : ""}`}
          onClick={() => {
            navigate(`/`);
            dispatch(setSelectedChatroom(null));
          }}
        >
          <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex flex-col grow overflow-auto h-full p-2">
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
  );
};

export default Chat;
