import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { socket } from "../../SocketClient";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setNewAlert } from "../../features/alert/alertSlice";
import { getChatrooms } from "../../features/chatroom/chatroomSlice";
import { getContacts } from "../../features/contact/contactSlice";
import {
  Message,
  getLastMessagesByChatroom,
} from "../../features/message/messageSlice";
import { signOutUser } from "../../features/user/userSlice";
import ConfirmationDialog from "../Reusable/ConfirmationDialog";
import AlertList from "./AlertList";
import Chat from "./Chat/Chat";
import SideBar from "./SideBar/SideBar";

const Dashboard = () => {
  // Global states in Redux
  const dispatch = useAppDispatch();
  const displayName = useAppSelector((state) => state.user.user.display_name);
  const selectedChatroom = useAppSelector(
    (state) => state.chatroom.selectedChatroom
  );
  const user = useAppSelector((state) => state.user.user);
  const chatrooms = useAppSelector((state) => state.chatroom.chatrooms);
  const contacts = useAppSelector((state) => state.contact.contacts);
  const alerts = useAppSelector((state) => state.alert.alerts);

  // Local states & refs & variables
  const [confirmationDialogIsOpen, setConfirmationDialogIsOpen] =
    useState(false);

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

  const fetchLastMessages = async () => {
    try {
      await dispatch(getLastMessagesByChatroom()).unwrap();
    } catch (error) {
      console.error(
        "An error occurred while dispatching getLastMessagesByChatroom:",
        error
      );
    }
  };

  useEffect(() => {
    fetchContacts();
    fetchChatrooms();
  }, [displayName]);

  useEffect(() => {
    fetchLastMessages();
  }, [chatrooms]);

  useEffect(() => {
    const handleNewMessage = (data: Message) => {
      console.log(selectedChatroom?.id, data.chatroom_id);
      if (selectedChatroom?.id === data.chatroom_id) return;
      if (
        chatrooms.some((chatroom) => chatroom.id === data.chatroom_id) === false
      )
        return;

      dispatch(
        setNewAlert({
          id: Math.max(...alerts.map((alert) => alert.id)) + 1,
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
          id: Math.max(...alerts.map((alert) => alert.id)) + 1,
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

    socket.on("global_new_message", handleNewMessage);
    socket.on("receive_new_contact", handleNewContact);

    return () => {
      socket.off("global_new_message", handleNewMessage);
      socket.off("receive_new_contact", handleNewContact);
    };
  }, [socket.id, selectedChatroom, chatrooms, contacts]);

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
    <>
      <div className="flex justify-between bg-accent items-center">
        <h1 className="p-3 px-6 text-accent-content text-lg">
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

      {/* Chat */}
      {selectedChatroom && <Chat />}

      {/* Alerts */}
      <AlertList />
    </>
  );
};

export default Dashboard;
