import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useMediaQuery } from "@react-hook/media-query";
import {
  Contact,
  setSelectedContact,
} from "../../../features/contact/contactSlice";
import {
  Chatroom,
  addNewChatroom,
  setSelectedChatroom,
} from "../../../features/chatroom/chatroomSlice";
import { socket } from "../../../SocketClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../Reusable/LoadingSpinner";

const ContactInfo = () => {
  const navigate = useNavigate();
  const { contactId } = useParams();

  // Global states in Redux
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const selectedContact = useAppSelector(
    (state) => state.contact.selectedContact
  );
  const chatrooms = useAppSelector((state) => state.chatroom.chatrooms);
  const contacts = useAppSelector((state) => state.contact.contacts);

  // Local states and variables
  const isTablet = useMediaQuery("(min-width: 768px)");
  const [initialFetch, setInitialFetch] = useState(false);
  const userAsContact: Contact = {
    id: user!.id!,
    display_name: user!.display_name!,
  };
  const selectedContactFromParams = contacts.find(
    (contact) => contact.id === contactId
  );

  useEffect(() => {
    setInitialFetch(true);
    if (contactId) {
      dispatch(setSelectedContact(selectedContactFromParams));
      if (selectedContact) setInitialFetch(false);
    }
  }, [contactId, selectedContactFromParams, selectedContact]);

  const sendNewChatroom = (newChatroom: Chatroom) => {
    if (socket && user?.display_name) {
      socket.emit("send_new_chatroom", newChatroom);
    }
  };

  const handleOpenChat = async (contact: Contact) => {
    const membersIds = [user.id, contact.id];
    let existingChatroom: Chatroom | undefined;

    // Check if a chat between this contact already exists
    chatrooms
      .filter((c) => c.members.length === 2)
      .forEach((c) => {
        if (c.members.every((member) => membersIds.includes(member.id)))
          existingChatroom = c;
      });

    if (existingChatroom) {
      dispatch(setSelectedChatroom(existingChatroom));
      navigate(`/chatrooms/${existingChatroom.id}`);
      return;
    }

    // Create new chat if not
    let newChatroomContacts: Contact[];

    if (userAsContact) {
      newChatroomContacts = [contact, userAsContact];

      try {
        const action = await dispatch(
          addNewChatroom({ name: "", members: newChatroomContacts })
        );

        const chatroom = action.payload as Chatroom;

        dispatch(setSelectedChatroom(chatroom));
        navigate(`/chatrooms/${chatroom.id}`);
        sendNewChatroom(action.payload as Chatroom);

        if (addNewChatroom.rejected.match(action)) {
          const error = action.payload as { message?: string };

          if (error && "message" in error) throw error;
        }
      } catch (error) {
        console.error(
          "An error occurred while dispatching addNewChatroom:",
          error
        );
      }
    }

    return;
  };
  return (
    <div className="h-screen max-h-full h-full justify-between md:w-3/5 lg:w-[70%] md:border-l-2 md:border-l-accent">
      {initialFetch ? (
        <div className="fixed h-full w-full flex justify-center items-center">
          <LoadingSpinner size={"lg"} colour={"neutral-content"} />
        </div>
      ) : (
        <div>
          <div className="flex flex-none justify-between px-2 bg-base-200 border-b-2 border-b-base-300 drop-shadow-sm">
            {/* Contact Display Name */}
            <h1 className="self-center p-3 text-lg text-neutral">
              {selectedContact?.display_name}
            </h1>

            {/* Close button */}
            <button
              className={`btn btn-circle btn-ghost ${isTablet ? "hidden" : ""}`}
              onClick={() => {
                navigate(`/`);
                dispatch(setSelectedContact(null));
              }}
            >
              <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
            </button>
          </div>
          {/* Contact Details */}
          <div className="self-center text-lg text-neutral p-3">
            Contact ID:{" "}
            <div className="text-base-content">{selectedContact?.id}</div>
          </div>
          <button
            className="btn btn-outline btn-primary mx-3"
            onClick={() => {
              if (selectedContact) handleOpenChat(selectedContact);
            }}
          >
            Message
          </button>
        </div>
      )}
    </div>
  );
};

export default ContactInfo;
