interface SideBarTab {
  isActive: boolean;
}

const SideBarTab: React.FC<SideBarTab> = (isActive) => {
  const getSideBarTabClasses = () => {
    let classes = "tab tab-lifted w-2/4";
    if (isActive) {
      return (classes += "tab-active");
    }
  };

  return (
    <div className="tabs fixed w-full z-10 bottom-0">
      <a className="tab tab-lifted w-2/4">Chatrooms</a>
      <a className="tab tab-lifted w-2/4 tab-active">Contacts</a>
    </div>
  );
};

export default SideBarTab;
