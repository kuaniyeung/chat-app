import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MouseEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  addNewChatroom,
  setSelectedChatroom,
} from "../../../features/chatroom/chatroomSlice";
import { Contact } from "../../../features/contact/contactSlice";

interface Props {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

const ContactsTab: React.FC<Props> = ({ onClick }) => {
  // Global states in Redux
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const userAsContact: Contact = {
    id: user!.id!,
    display_name: user!.display_name!,
  };

  const contacts = useAppSelector((state) => state.contact.contacts);
  const chatrooms = useAppSelector((state) => state.chatroom.chatrooms);

  const handleOpenChat = async (contact: Contact) => {
    const membersIds = [user.id, contact.id];
    let existingChatroom;

    // Check if a chat between this contact already exists
    chatrooms
      .filter((c) => c.members.length === 2)
      .forEach((c) => {
        if (c.members.every((member) => membersIds.includes(member.id)))
          existingChatroom = c;
      });

    if (existingChatroom)
      return dispatch(setSelectedChatroom(existingChatroom));

    // Create new chat if not
    let newChatroomContacts: Contact[];

    if (userAsContact) {
      newChatroomContacts = [contact, userAsContact];

      try {
        const action = await dispatch(
          addNewChatroom({ name: "", members: newChatroomContacts })
        );

        dispatch(setSelectedChatroom(action.payload));

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
      <h1 className="text-secondary text-center p-3 uppercase text-sm italic text-primary bg-base-200 flex justify-center items-center">
        <span className="">Your Contacts</span>

        <button
          className="btn btn-sm btn-primary px-2 fixed right-2 bg-secondary"
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
          <div key={contact.id} className="block cursor-pointer my-5 mx-6">
            <a className="text-neutral" onClick={() => handleOpenChat(contact)}>
              {contact.display_name}
            </a>
          </div>
        );
      })}
    </>
  );
};

export default ContactsTab;
