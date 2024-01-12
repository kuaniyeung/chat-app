import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MouseEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  Chatroom,
  addNewChatroom,
  setSelectedChatroom,
} from "../../../features/chatroom/chatroomSlice";
import { Contact } from "../../../features/contact/contactSlice";
import { socket } from "../../../SocketClient";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@react-hook/media-query";
interface Props {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

const ContactsTab: React.FC<Props> = ({ onClick }) => {
  const navigate = useNavigate();

  // Global states in Redux
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const selectedChatroom = useAppSelector(
    (state) => state.chatroom.selectedChatroom
  );
  const contacts = useAppSelector((state) => state.contact.contacts);
  const chatrooms = useAppSelector((state) => state.chatroom.chatrooms);

  // Local states and variables
  const isMobile = useMediaQuery("(max-width: 768px");
  const userAsContact: Contact = {
    id: user!.id!,
    display_name: user!.display_name!,
  };

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
    <>
      <h1 className="relative text-secondary text-center p-3 uppercase text-sm italic bg-base-200 flex justify-center items-center">
        <span>Your Contacts</span>

        <button
          className={`btn btn-sm btn-primary px-2 right-2 bg-secondary ${
            selectedChatroom && isMobile ? "left-full" : "absolute"
          }`}
          onClick={onClick}
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </h1>

      {/* If no contacts added: */}
      {!Object.keys(contacts).length && (
        <h1 className="m-4 text-base-300 text-center">No Saved Contacts</h1>
      )}

      {/* List out existing contacts: */}
      {contacts.map((contact) => {
        return (
          <a
            key={contact.id}
            className="block cursor-pointer my-5 mx-6"
            onClick={() => handleOpenChat(contact)}
          >
            <div className="text-neutral">{contact.display_name}</div>
          </a>
        );
      })}
    </>
  );
};

export default ContactsTab;
