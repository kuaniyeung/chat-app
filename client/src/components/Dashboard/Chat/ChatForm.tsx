import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useEffect, useRef, useState } from "react";
import WarningDialog from "../../Dialogs/WarningDialog";
import LoadingSpinner from "../../LoadingSpinner";
import {
  addNewMessage,
  setNewMessage,
} from "../../../features/message/MessageSlice";
import { DateTime } from "luxon";

const ChatForm = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.message.loading);
  const user = useAppSelector((state) => state.user.user);
  const selectedChatroom = useAppSelector(
    (state) => state.chatroom.selectedChatroom
  );

  const messageRef = useRef<HTMLInputElement | null>(null);

  const [message, setMessage] = useState("");
  const [errMsg, setErrMsg] = useState<string | undefined>("");
  const [warningDialogIsOpen, setWarningDialogIsOpen] =
    useState<boolean>(false);

  useEffect(() => {
    messageRef.current?.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [message]);

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

      dispatch(
        setNewMessage({
          id: null,
          sender_id: user.id,
          content: message,
          chatroom_id: selectedChatroom?.id,
          created_at: DateTime.now(),
        })
      );
      setMessage("");
    } catch (error) {
      console.error("An error occurred while dispatching createUser:", error);
    }
  };

  return (
    <div className="w-full flex-auto">
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
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          autoComplete="off"
          required
          className="input input-bordered input-primary w-full max-w-xs mr-1"
        />

        <button
          type="submit"
          className="btn btn-circle btn-primary"
          disabled={message === "" ? true : false}
        >
          {loading ? (
            <LoadingSpinner colour={"neutral-content"} />
          ) : (
            <FontAwesomeIcon icon={faPaperPlane} className="w-4 h-4" />
          )}
        </button>
      </form>
    </div>
  );
};

export default ChatForm;
