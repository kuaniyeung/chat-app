import { useEffect, useState } from "react";
import AddNewChatroomDialog from "./AddNewChatroomDialog";
import AddNewContactDialog from "./AddNewContactDialog";
import ChatroomsTab from "./ChatroomsTab";
import ContactsTab from "./ContactsTab";
import SideBarTab from "./SideBarTab";
import { Route, Routes } from "react-router-dom";
import { useMediaQuery } from "@react-hook/media-query";
import Chat from "../Chat/Chat";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { setSelectedChatroom } from "../../../features/chatroom/chatroomSlice";

const SideBar = () => {
  // Global states in Redux
  const dispatch = useAppDispatch();
  const chatrooms = useAppSelector((state) => state.chatroom.chatrooms);

  // Local states & refs & variables
  const isTablet = useMediaQuery("(min-width: 768px)");
  const [showAddChatroom, setShowAddChatroom] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);
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
  }, [isTablet]);

  const ResponsiveHomePage = () => {
    return isTablet ? (
      <Chat />
    ) : (
      <ChatroomsTab onClick={() => setShowAddChatroom(!showAddChatroom)} />
    );
  };

  return (
    <div className="relative flex-grow ">
      <Routes>
        {isTablet ? (
          ""
        ) : (
          <Route
            path="/"
            index
            element={
              <ChatroomsTab
                onClick={() => setShowAddChatroom(!showAddChatroom)}
              />
            }
          />
        )}

        <Route
          path="chatrooms"
          element={
            <ChatroomsTab
              onClick={() => setShowAddChatroom(!showAddChatroom)}
            />
          }
        ></Route>

        <Route
          path="contacts"
          element={
            <ContactsTab onClick={() => setShowAddContact(!showAddContact)} />
          }
        ></Route>
      </Routes>

      <AddNewChatroomDialog
        isAddChatroomOpen={showAddChatroom}
        closeAdd={() => setShowAddChatroom(!showAddChatroom)}
      />

      <AddNewContactDialog
        isAddContactOpen={showAddContact}
        closeAdd={() => setShowAddContact(!showAddContact)}
      />

      <SideBarTab />
    </div>
  );
};

export default SideBar;
