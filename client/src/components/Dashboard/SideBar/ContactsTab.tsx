import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { MouseEvent, useEffect } from "react";

interface Props {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

const ContactsTab: React.FC<Props> = ({ onClick }) => {
  const dispatch = useAppDispatch();
  const contacts = useAppSelector((state) => state.contact.contacts);

  return (
    <>
      <h1>Your Contacts</h1>

      {/* If no contacts added: */}
      {!contacts && <h1>No Saved Contacts</h1>}

      {/* List out existing contacts: */}
      {contacts.map((contact) => {
        return (
          <a key={contact.id} className="block cursor-pointer">
            {contact.display_name}
          </a>
        );
      })}

      <button className="btn btn-secondary" onClick={onClick}>
        Add New Contacts
      </button>
    </>
  );
};

export default ContactsTab;
