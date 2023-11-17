import { useAppDispatch, useAppSelector } from "../../../app/hooks";

const ContactsTab = () => {
  const contacts = useAppSelector((state) => state.contact.contacts);

  return (
    <>
      <h1>Your Contacts</h1>
      {!contacts && <h1>No Saved Contacts</h1>}
      <button className="btn btn-secondary">Add New Contacts</button>
    </>
  );
};

export default ContactsTab;
