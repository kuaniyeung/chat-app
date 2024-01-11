import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { removeAlert } from "../../features/alert/alertSlice";
import {
  setAlerted,
  setSelectedChatroom,
} from "../../features/chatroom/chatroomSlice";
import {
  getContacts,
  setNewContact,
} from "../../features/contact/contactSlice";
import { setNewMessage } from "../../features/message/messageSlice";
import Alert from "../Reusable/Alert";
import { useNavigate } from "react-router-dom";

const AlertList = () => {
  const navigate = useNavigate();

  // Global states in Redux
  const dispatch = useAppDispatch();
  const alerts = useAppSelector((state) => state.alert.alerts);

  return (
    <div className="fixed top-0 w-full">
      {alerts.map((alert, i) => {
        if (alert.type === "newMessage") {
          return (
            <div key={i}>
              <Alert
                onConfirm={() => {
                  dispatch(
                    setSelectedChatroom(alert.data.newMessage?.chatroom)
                    );
                    dispatch(setNewMessage(alert.data.newMessage?.message));
                    dispatch(removeAlert({alert_id: alert.id}));
                    dispatch(
                      setAlerted({
                        chatroom_id: alert.data.newMessage?.chatroom.id,
                        alerted: false,
                      })
                      );
                      navigate(`/chatrooms/${alert.data.newMessage?.chatroom.id}`);
                }}
                onCancel={() => {
                  navigate(`/chatrooms`);
                  dispatch(removeAlert({ alert_id: alert.id }));
                }}
                title={"New Message!"}
                text={"You have unread messages"}
              />
            </div>
          );
        }

        if (alert.type === "newContact") {
          return (
            <div key={i}>
              <Alert
                onConfirm={async () => {
                  dispatch(setNewContact(alert.data.newContact));
                  // dispatch(setContactTabSelected(true));
                  // dispatch(setChatroomTabSelected(false));
                  try {
                    await dispatch(getContacts()).unwrap();
                  } catch (error) {
                    console.error(
                      "An error occurred while dispatching getContacts:",
                      error
                    );
                  }
                  dispatch(removeAlert(alert.id));
                }}
                onCancel={() => dispatch(removeAlert(alert.id))}
                title={"New Contact!"}
                text={"Someone added you as a new contact"}
              />
            </div>
          );
        }
      })}
    </div>
  );
};

export default AlertList;
