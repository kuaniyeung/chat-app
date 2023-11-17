import ChatroomsTab from "./ChatroomsTab";
import ContactsTab from "./ContactsTab";
import SideBarTab from "./SideBarTab";
import { useAppSelector } from "../../../app/hooks";

const SideBar = () => {
  const isChatroomSelected = useAppSelector(
    (state) => state.chatroom.isSelected
  );
  const isContactSelected = useAppSelector((state) => state.contact.isSelected);

  return (
    <>
      {isChatroomSelected && <ChatroomsTab />}
      {isContactSelected && <ContactsTab />}
      <SideBarTab />
    </>
  );
};

export default SideBar;
