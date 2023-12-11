import { useAppSelector } from "../../../app/hooks";
import { MouseEvent } from "react";

interface Props {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

const ContactsTab: React.FC<Props> = ({ onClick }) => {
  // Global states in Redux
  const contacts = useAppSelector((state) => state.contact.contacts);

  return (
    <>
      <h1>Your Contacts</h1>

      {/* If no contacts added: */}
      {!Object.keys(contacts).length && <h1>No Saved Contacts</h1>}

      {/* List out existing contacts: */}
      {contacts.map((contact) => {
        return (
          <div key={contact.id} className="block cursor-pointer">
            {" "}
            <a>{contact.display_name}</a>
          </div>
        );
      })}

      <button className="btn btn-secondary" onClick={onClick}>
        Add New Contacts
      </button>
    </>
  );
};

export default ContactsTab;
