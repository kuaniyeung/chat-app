import { useState } from "react";
import { useAppSelector } from "../../../app/hooks";
import AddNewChatroomDialog from "./AddNewChatroomDialog";
import AddNewContactDialog from "./AddNewContactDialog";
import ChatroomsTab from "./ChatroomsTab";
import ContactsTab from "./ContactsTab";
import SideBarTab from "./SideBarTab";

const SideBar = () => {
  // Global states in Redux
  const isChatroomSelected = useAppSelector(
    (state) => state.chatroom.isSelected
    );
    const isContactSelected = useAppSelector((state) => state.contact.isSelected);
    
    // Local states & refs & variables
  const [showAddChatroom, setShowAddChatroom] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);

  return (
    <>
      {isChatroomSelected && (
        <ChatroomsTab onClick={() => setShowAddChatroom(!showAddChatroom)} />
      )}

      <AddNewChatroomDialog
        isAddChatroomOpen={showAddChatroom}
        closeAdd={() => setShowAddChatroom(!showAddChatroom)}
      />

      {isContactSelected && (
        <ContactsTab onClick={() => setShowAddContact(!showAddContact)} />
      )}

      <AddNewContactDialog
        isAddContactOpen={showAddContact}
        closeAdd={() => setShowAddContact(!showAddContact)}
      />

      <SideBarTab />
    </>
  );
};

export default SideBar;
