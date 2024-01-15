import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { socket } from "../../SocketClient";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setNewAlert } from "../../features/alert/alertSlice";
import {
  Chatroom,
  getChatrooms,
  setAlerted,
  setLastMessage,
  setNewChatroom,
  setSelectedChatroom,
} from "../../features/chatroom/chatroomSlice";
import { getContacts } from "../../features/contact/contactSlice";
import { Message } from "../../features/message/messageSlice";
import { signOutUser } from "../../features/user/userSlice";
import ConfirmationDialog from "../Reusable/ConfirmationDialog";
import AlertList from "./AlertList";
import SideBar from "./SideBar/SideBar";
import { Outlet, Route, Routes, useNavigate } from "react-router-dom";
import Chat from "./Chat/Chat";
import { useMediaQuery } from "@react-hook/media-query";
import NoRouteMatch from "../Reusable/NoRouteMatch";

const Dashboard = () => {
const navigate = useNavigate();

  // Global states in Redux
  const dispatch = useAppDispatch();
  const displayName = useAppSelector((state) => state.user.user.display_name);
  const user = useAppSelector((state) => state.user.user);
  const chatrooms = useAppSelector((state) => state.chatroom.chatrooms);
  const selectedChatroom = useAppSelector(
    (state) => state.chatroom.selectedChatroom
  );
  const contacts = useAppSelector((state) => state.contact.contacts);
  const selectedContact = useAppSelector(state => state.contact.selectedContact)
  const alerts = useAppSelector((state) => state.alert.alerts);

  // Local states & refs & variables
  const isTablet = useMediaQuery("(min-width: 768px)");
  const [confirmationDialogIsOpen, setConfirmationDialogIsOpen] =
    useState(false);
  const newestChatroom: Chatroom = chatrooms.reduce(
    (prevChatroom, currentChatroom) => {
      const prevTimestamp = new Date(
        prevChatroom.lastMessage?.created_at || 0
      ).getTime();
      const currentTimestamp = new Date(
        currentChatroom.lastMessage?.created_at || 0
      ).getTime();

      return currentTimestamp > prevTimestamp ? currentChatroom : prevChatroom;
    },
    chatrooms[0]
  );

  useEffect(() => {
    if (isTablet && newestChatroom) {
      dispatch(setSelectedChatroom(newestChatroom));
      navigate(`/chatrooms/${newestChatroom.id}`);
    }

    return () => {
      dispatch(setSelectedChatroom(null));
    };
  }, [isTablet, newestChatroom?.id]);

  // Fetching existing chatrooms and contacts

  const fetchContacts = async () => {
    try {
      await dispatch(getContacts()).unwrap();
    } catch (error) {
      console.error("An error occurred while dispatching getContacts:", error);
    }
  };

  const fetchChatrooms = async () => {
    try {
      await dispatch(getChatrooms()).unwrap();
    } catch (error) {
      console.error("An error occurred while dispatching getChatrooms:", error);
    }
  };

  useEffect(() => {
    fetchContacts();
    fetchChatrooms();
  }, [displayName, selectedChatroom]);

  // Listening to socket for new contacts and messages

  useEffect(() => {
    const handleNewChatroom = (data: Chatroom) => {
      if (data.members.some((member) => member.id === user.id) === false)
        return;

      dispatch(setNewChatroom(data));
      dispatch(setAlerted({ chatroom_id: data.id, alerted: true }));
      fetchChatrooms();
    };

    const handleNewMessage = (data: Message) => {
      if (selectedChatroom?.id === data.chatroom_id) return;
      if (
        chatrooms.some((chatroom) => chatroom.id === data.chatroom_id) === false
      )
        return;

      dispatch(
        setNewAlert({
          id:
            alerts.reduce(
              (maxId, alert) => (alert.id > maxId ? alert.id : maxId),
              0
            ) + 1,
          type: "newMessage",
          data: {
            newContact: null,
            newMessage: {
              chatroom: chatrooms.find(
                (chatroom) => chatroom.id === data.chatroom_id
              ),
              message: {
                id: null,
                sender_display_name: data.sender_display_name,
                content: data.content,
                chatroom_id: data.chatroom_id,
                created_at: data.created_at,
              },
            },
          },
        })
      );

      dispatch(
        setLastMessage({
          sender_display_name: data.sender_display_name,
          content: data.content,
          chatroom_id: data.chatroom_id,
          created_at: data.created_at,
        })
      );

      dispatch(setAlerted({ chatroom_id: data.chatroom_id, alerted: true }));
    };

    const handleNewContact = (data: {
      contact_display_name: string;
      sender_id: string;
      sender_display_name: string;
    }) => {
      console.log("added contact");
      if (user.display_name !== data.contact_display_name) return;

      dispatch(
        setNewAlert({
          id:
            alerts.reduce(
              (maxId, alert) => (alert.id > maxId ? alert.id : maxId),
              0
            ) + 1,
          type: "newContact",
          data: {
            newContact: {
              id: data.sender_id,
              display_name: data.sender_display_name,
            },
            newMessage: null,
          },
        })
      );
    };

    socket.on("global_receive_new_chatroom", handleNewChatroom);
    socket.on("global_new_message", handleNewMessage);
    socket.on("receive_new_contact", handleNewContact);

    return () => {
      socket.off("global_receive_new_chatroom", handleNewChatroom);
      socket.off("global_new_message", handleNewMessage);
      socket.off("receive_new_contact", handleNewContact);
    };
  }, [socket.id, selectedChatroom, chatrooms.length, contacts.length]);

  // Handle logging out of account

  const handleConfirmLogOut = async () => {
    try {
      const action = await dispatch(signOutUser());

      if (signOutUser.rejected.match(action)) {
        const error = action.payload as { message?: string };

        if (error && "message" in error) {
          console.error(error.message);
          return;
        }
      }
    } catch (error) {
      console.error("An error occurred while dispatching getSession:", error);
    }

    setConfirmationDialogIsOpen(false);
    return;
  };

  return (
    <div className="md:flex">
      <div
        className={`md:w-2/5 lg:w-[30%] h-screen flex flex-col ${
          selectedChatroom || selectedContact ? "fixed left-full md:static" : ""
        }`}
      >
        <div className="flex justify-between bg-accent items-center">
          <h1 className="p-3 px-6 text-accent-content text-lg border-b-2 border-b-accent">
            <span className="text-xs uppercase">Welcome back </span>
            <span className="font-bold ml-1">{displayName}</span>
          </h1>
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-md btn-circle btn-ghost">
              <FontAwesomeIcon icon={faEllipsisVertical} />
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow rounded-xl bg-base-100 w-max"
            >
              <li>
                <a
                  onClick={() => {
                    setConfirmationDialogIsOpen(true);
                  }}
                  className="text-neutral rounded-xl p-2"
                >
                  Sign Out
                </a>
              </li>
            </ul>
          </div>
        </div>
        <SideBar />

        {/* Confirmation Dialog */}
        <ConfirmationDialog
          isOpen={confirmationDialogIsOpen}
          onConfirm={handleConfirmLogOut}
          onCancel={() => setConfirmationDialogIsOpen(false)}
          text={"Are you sure you want to sign out?"}
        />

        {/* Alerts */}
        <AlertList />
      </div>

      <Outlet />
    </div>
  );
};

export default Dashboard;
