import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MouseEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { setSelectedContact } from "../../../features/contact/contactSlice";

import { useMediaQuery } from "@react-hook/media-query";
import { useNavigate } from "react-router-dom";
interface Props {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

const ContactsTab: React.FC<Props> = ({ onClick }) => {
  const navigate = useNavigate();

  // Global states in Redux
  const dispatch = useAppDispatch();
  const selectedChatroom = useAppSelector(
    (state) => state.chatroom.selectedChatroom
  );
  const contacts = useAppSelector((state) => state.contact.contacts);

  // Local states and variables
  const isMobile = useMediaQuery("(max-width: 768px");


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
            onClick={() => {
              dispatch(setSelectedContact(contact));
              navigate(`contacts/${contact.id}`)
            }}
          >
            <div className="text-neutral">{contact.display_name}</div>
          </a>
        );
      })}
    </>
  );
};

export default ContactsTab;
