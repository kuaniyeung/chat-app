import { useMediaQuery } from "@react-hook/media-query";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { setSelectedChatroom } from "../../../features/chatroom/chatroomSlice";
import AddNewChatroomDialog from "./AddNewChatroomDialog";
import AddNewContactDialog from "./AddNewContactDialog";
import ChatroomsTab from "./ChatroomsTab";
import ContactsTab from "./ContactsTab";
import SideBarTab from "./SideBarTab";

export type TabType = "chatroom" | "contact"

const SideBar = () => {
  // Global states in Redux
  const dispatch = useAppDispatch();
  const chatrooms = useAppSelector((state) => state.chatroom.chatrooms);

  // Local states & refs & variables
  const isTablet = useMediaQuery("(min-width: 768px)");
  const [showAddChatroom, setShowAddChatroom] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);
  const [selectedTab, setSelectedTab] = useState<TabType>("chatroom");
  const newestChatroom = chatrooms.reduce((prevChatroom, currentChatroom) => {
    const prevTimestamp = new Date(
      prevChatroom.lastMessage?.created_at || 0
    ).getTime();
    const currentTimestamp = new Date(
      currentChatroom.lastMessage?.created_at || 0
    ).getTime();

    return currentTimestamp > prevTimestamp ? currentChatroom : prevChatroom;
  }, chatrooms[0]);

  useEffect(() => {
    if (isTablet) {
      dispatch(setSelectedChatroom(newestChatroom));
    }

    dispatch(setSelectedChatroom(null));
  }, [isTablet])

  const handleTabOnClick = (tab: TabType) => {
    setSelectedTab(tab);
  };

  return (
    <div className="relative flex-grow ">
      {selectedTab === "chatroom" && (
        <ChatroomsTab onClick={() => setShowAddChatroom(!showAddChatroom)} />
      )}

      <AddNewChatroomDialog
        isAddChatroomOpen={showAddChatroom}
        closeAdd={() => setShowAddChatroom(!showAddChatroom)}
      />

      {selectedTab === "contact" && (
        <ContactsTab onClick={() => setShowAddContact(!showAddContact)} />
      )}

      <AddNewContactDialog
        isAddContactOpen={showAddContact}
        closeAdd={() => setShowAddContact(!showAddContact)}
      />

      <SideBarTab
        selectedTab={selectedTab}
        handleTabOnClick={handleTabOnClick}
      />
    </div>
  );
};

export default SideBar;
