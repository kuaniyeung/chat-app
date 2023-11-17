import { useAppDispatch, useAppSelector } from "../../../app/hooks";

const ContactsTab = () => {
  const contacts = useAppSelector((state) => state.contact.contacts);

  if (!contacts) return <h1>No Saved Contacts</h1>;
};

export default ContactsTab;
