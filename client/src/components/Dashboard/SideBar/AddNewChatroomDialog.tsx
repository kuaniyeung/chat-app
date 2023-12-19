import { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  Chatroom,
  addNewChatroom,
  setSelectedChatroom,
} from "../../../features/chatroom/chatroomSlice";
import WarningDialog from "../../Reusable/WarningDialog";
import LoadingSpinner from "../../Reusable/LoadingSpinner";
import { Contact } from "../../../features/contact/contactSlice";
import { socket } from "../../../SocketClient";

interface Props {
  isAddChatroomOpen: boolean;
  closeAdd: Function;
}

const AddNewChatroomDialog: React.FC<Props> = ({
  isAddChatroomOpen,
  closeAdd,
}) => {
  // Global states in Redux
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const userAsContact: Contact = {
    id: user!.id!,
    display_name: user!.display_name!,
  };
  const contacts = useAppSelector((state) => state.contact.contacts);
  const loading = useAppSelector((state) => state.chatroom.loading);

  // Local states & refs & variables
  const nameRef = useRef<HTMLInputElement | null>(null);
  const [name, setName] = useState("");
  const [selectedContactsIds, setSelectedContactsIds] = useState<string[]>([]);
  const [errMsg, setErrMsg] = useState<string | undefined>("");
  const [warningDialogIsOpen, setWarningDialogIsOpen] =
    useState<boolean>(false);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const sendNewChatroom = (newChatroom: Chatroom) => {
    if (socket && user?.display_name) {
      socket.emit("send_new_chatroom", newChatroom);
    }
  };

  const handleCheckboxChange = (contactId: string) => {
    setSelectedContactsIds((prevSelected) =>
      prevSelected.includes(contactId)
        ? prevSelected.filter((id) => id !== contactId)
        : [...prevSelected, contactId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let selectedContacts: Contact[] = contacts.filter((contact) =>
      selectedContactsIds.includes(contact.id)
    );

    if (userAsContact) {
      selectedContacts = [...selectedContacts, userAsContact];
    }
    try {
      const action = await dispatch(
        addNewChatroom({ name, members: selectedContacts })
      );

      dispatch(setSelectedChatroom(action.payload as Chatroom));

      sendNewChatroom(action.payload as Chatroom);

      if (addNewChatroom.rejected.match(action)) {
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
      console.error(
        "An error occurred while dispatching addNewChatroom:",
        error
      );
    }

    setName("");
    setSelectedContactsIds([]);
    closeAdd();
  };

  return (
    <>
      <dialog
        id="my_modal_5"
        className={`modal ${isAddChatroomOpen ? "modal-open" : ""}`}
      >
        <div className="modal-box form-control w-full max-w-sm">
          <WarningDialog
            isOpen={warningDialogIsOpen}
            onConfirm={() => {
              setWarningDialogIsOpen(false);
              setName("");
            }}
            text={errMsg}
          />
          <form
            action="/submit-form"
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            <div>
              <label htmlFor="name" className="label">
                <span className="label-text">New Chatroom Name</span>
              </label>
              <input
                type="text"
                ref={nameRef}
                placeholder="Enter new chatroom name"
                onChange={(e) => setName(e.target.value)}
                value={name}
                autoComplete="off"
                className="input input-bordered w-full max-w-xs"
              />
            </div>

            {contacts.map((contact) => (
              <div key={contact.id} className="mt-4 mx-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-indigo-600"
                    onChange={() => {
                      handleCheckboxChange(contact.id);
                    }}
                    checked={selectedContactsIds.includes(contact.id)}
                  />
                  <span className="ml-2">{contact.display_name}</span>
                </label>
              </div>
            ))}

            {loading ? (
              <button
                type="submit"
                className="btn btn-primary w-full max-w-xs mt-4"
              >
                <LoadingSpinner size={"md"} colour={"neutral-content"} />
              </button>
            ) : (
              <button
                type="submit"
                className="btn btn-primary w-full max-w-xs mt-4"
              >
                Create New Chatroom
              </button>
            )}
          </form>
          <button
            className="btn bg-base-300 form-control w-full max-w-xs mt-4"
            onClick={(e) => {
              setSelectedContactsIds([]);
              closeAdd(e);
            }}
          >
            Cancel
          </button>
        </div>
      </dialog>
    </>
  );
};

export default AddNewChatroomDialog;
