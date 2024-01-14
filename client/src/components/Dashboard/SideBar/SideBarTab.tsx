import { TabType } from "./SideBar";

interface Props {
  selectedTab: string;
  handleTabOnClick: (tab: TabType) => void;
}

const SideBarTab: React.FC<Props> = ({ selectedTab, handleTabOnClick }) => {
  // Local states & refs & variables
  const classes =
    "tab w-2/4 text-base transition-all duration-300 ease-in-out transform";

  return (
    <nav className="absolute tabs tabs-boxed bg-base-200 w-full bottom-0 p-2">
      <a
        className={
          selectedTab === "chatroom"
            ? `${classes} tab-active !bg-primary`
            : `${classes}`
        }
        onClick={() => {
          handleTabOnClick("chatroom");
        }}
      >
        Chatrooms
      </a>
      <a
        className={
          selectedTab === "contact"
            ? `${classes} tab-active !bg-secondary`
            : `${classes}`
        }
        onClick={() => {
          handleTabOnClick("contact");
        }}
      >
        Contacts
      </a>
    </nav>
  );
};

export default SideBarTab;
