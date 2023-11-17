import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { setChatroomActive } from "../../../features/chatroom/ChatroomSlice";
import { setContactActive } from "../../../features/contact/ContactSlice";

const SideBarTab = () => {
  const dispatch = useAppDispatch();
  const isChatroomSelected = useAppSelector(
    (state) => state.chatroom.isSelected
  );
  const isContactSelected = useAppSelector((state) => state.contact.isSelected);
  const classes = "tab w-2/4 transition-all duration-300 ease-in-out transform";

  return (
    <div className="tabs tabs-boxed fixed w-full z-10 bottom-0">
      <a
        className={isChatroomSelected ? `${classes} tab-active` : `${classes}`}
        onClick={() => {
          dispatch(setChatroomActive(true));
          dispatch(setContactActive(false));
        }}
      >
        Chatrooms
      </a>
      <a
        className={isContactSelected ? `${classes} tab-active` : `${classes}`}
        onClick={() => {
          dispatch(setContactActive(true));
          dispatch(setChatroomActive(false));
        }}
      >
        Contacts
      </a>
    </div>
  );
};

export default SideBarTab;
