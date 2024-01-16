import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DateTime } from "luxon";
import { useEffect, useRef, useState } from "react";
import { socket } from "../../../SocketClient";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  setAlerted,
  setLastMessage,
} from "../../../features/chatroom/chatroomSlice";
import {
  Message,
  addNewMessage,
  setNewMessage,
} from "../../../features/message/messageSlice";
import LoadingSpinner from "../../Reusable/LoadingSpinner";
import WarningDialog from "../../Reusable/WarningDialog";

const ChatForm = () => {
  // Global states in Redux
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.message.loading);
  const user = useAppSelector((state) => state.user.user);
  const selectedChatroom = useAppSelector(
    (state) => state.chatroom.selectedChatroom
  );
  const numOfAlertedChatrooms = useAppSelector(state => state.chatroom.alertedChatrooms)

  // Local states & refs
  const [message, setMessage] = useState("");
  const [errMsg, setErrMsg] = useState<string | undefined>("");
  const [warningDialogIsOpen, setWarningDialogIsOpen] =
    useState<boolean>(false);
  const messageRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    messageRef.current?.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [message]);

  useEffect(() => {
    const handleNewMessage = (data: Message) => {
      dispatch(
        setNewMessage({
          id: null,
          sender_display_name: data.sender_display_name,
          content: data.content,
          chatroom_id: data.chatroom_id,
          created_at: data.created_at,
        })
      );
      
      dispatch(
        setLastMessage({
          sender_display_name: data.sender_display_name,
          content: data.content,
          chatroom_id: data.chatroom_id,
          created_at: data.created_at,
        })
      );

      dispatch(setAlerted({ chatroom_id: data.chatroom_id, alerted: true }));
    };

    if (selectedChatroom) {
      socket.emit("join_room", selectedChatroom.id.toString());
      socket.on("receive_message", handleNewMessage);
    }

    return () => {
      if (selectedChatroom) {
        socket.emit("leave_room", selectedChatroom.id.toString());
        socket.off("receive_message", handleNewMessage);
      }
    };
  }, [socket.id, selectedChatroom, numOfAlertedChatrooms]);

  const sendMessage = () => {
    if (socket && selectedChatroom && user?.display_name) {
      socket.emit("send_message", {
        id: null,
        content: message,
        chatroom_id: selectedChatroom.id,
        sender_display_name: user.display_name,
        created_at: DateTime.now().toISO(),
      });
    }
  };

  const sendStartTypingSignal = () => {
    if (socket && selectedChatroom && user.id) {
      socket.emit("send_typing", {
        chatroom_id: selectedChatroom.id.toString(),
        sender_id: user.id,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const action = await dispatch(addNewMessage({ content: message }));

      if (addNewMessage.rejected.match(action)) {
        const error = action.payload as { message?: string };

        if (error && "message" in error) {
          setErrMsg(error.message);
          setWarningDialogIsOpen(true);
          return;
        }
        console.error("An unknown error occurred.");
        setErrMsg("An unknown error occurred.");
      }
    } catch (error) {
      console.error("An error occurred while dispatching createUser:", error);
    }

    sendMessage();

    dispatch(
      setNewMessage({
        id: null,
        sender_display_name: user.display_name,
        content: message,
        chatroom_id: selectedChatroom?.id,
        created_at: DateTime.now().toISO(),
      })
    );

    dispatch(
      setLastMessage({
        sender_display_name: user.display_name,
        content: message,
        chatroom_id: selectedChatroom?.id,
        created_at: DateTime.now().toISO(),
      })
    );

    setMessage("");
  };

  return (
    <div className="w-full flex-auto mt-3 p-2">
      <WarningDialog
        isOpen={warningDialogIsOpen}
        onConfirm={() => {
          setWarningDialogIsOpen(false);
          setMessage("");
        }}
        text={errMsg}
      />
      <form
        action="/submit-form"
        onSubmit={handleSubmit}
        className="flex w-full"
      >
        <input
          type="text"
          ref={messageRef}
          placeholder="New message"
          onChange={(e) => {
            setMessage(e.target.value);
            sendStartTypingSignal();
          }}
          value={message}
          autoComplete="off"
          required
          className="input input-bordered input-primary w-full mr-1"
        />

        <button
          type="submit"
          className="btn btn-circle btn-primary disabled:btn-primary disabled:opacity-30 ml-1"
          disabled={message === "" ? true : false}
        >
          {loading ? (
            <LoadingSpinner size={"md"} colour={"neutral-content"} />
          ) : (
            <FontAwesomeIcon icon={faPaperPlane} className="w-4 h-4" />
          )}
        </button>
      </form>
    </div>
  );
};

export default ChatForm;
