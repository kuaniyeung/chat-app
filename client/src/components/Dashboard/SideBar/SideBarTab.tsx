import { NavLink, useLocation } from "react-router-dom";

const SideBarTab = () => {
  const location = useLocation();

  // Local states & refs & variables
  const classes =
    "tab w-2/4 text-base transition-all duration-300 ease-in-out transform";

  return (
    <nav className="absolute tabs tabs-boxed bg-base-200 w-full bottom-0 p-2">
      <NavLink
        to="/chatrooms"
        className={({ isActive }) =>
          isActive || location.pathname === "/"
            ? `${classes} tab-active !bg-primary`
            : `${classes}`
        }
      >
        Chatrooms
      </NavLink>
      <NavLink
        to="/contacts"
        className={({ isActive }) =>
          isActive ? `${classes} tab-active !bg-secondary` : `${classes}`
        }
      >
        Contacts
      </NavLink>
    </nav>
  );
};

export default SideBarTab;
