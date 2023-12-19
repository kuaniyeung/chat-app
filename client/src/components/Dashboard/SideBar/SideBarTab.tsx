import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { setChatroomTabSelected } from "../../../features/chatroom/chatroomSlice";
import { setContactTabSelected } from "../../../features/contact/contactSlice";

const SideBarTab = () => {
  // Global states in Redux
  const dispatch = useAppDispatch();
  const isChatroomSelected = useAppSelector(
    (state) => state.chatroom.isSelected
  );
  const isContactSelected = useAppSelector((state) => state.contact.isSelected);

  // Local states & refs & variables
  const classes =
    "tab w-2/4 text-base transition-all duration-300 ease-in-out transform";



  return (
    <div className="tabs tabs-boxed bg-base-200 fixed w-full z-10 bottom-0 p-2">
      <a
        className={
          isChatroomSelected
            ? `${classes} tab-active !bg-primary`
            : `${classes}`
        }
        onClick={() => {
          dispatch(setChatroomTabSelected(true));
          dispatch(setContactTabSelected(false));
        }}
      >
        Chatrooms
      </a>
      <a
        className={
          isContactSelected
            ? `${classes} tab-active !bg-secondary`
            : `${classes}`
        }
        onClick={() => {
          dispatch(setContactTabSelected(true));
          dispatch(setChatroomTabSelected(false));
        }}
      >
        Contacts
      </a>
    </div>
  );
};

export default SideBarTab;
