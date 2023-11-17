import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import SideBar from "./SideBar/SideBar";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import ConfirmationDialog from "../Dialogs/ConfirmationDialog";
import { signOutUser } from "../../features/user/userSlice";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const displayName = useAppSelector((state) => state.user.user.display_name);
  const [confirmationDialogIsOpen, setConfirmationDialogIsOpen] =
    useState(false);

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
      <div className="flex justify-between">
        <h1>Welcome back {displayName}</h1>
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-sm btn-circle btn-ghost">
            <FontAwesomeIcon icon={faEllipsisVertical} />
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-max"
          >
            <li>
              <a
                onClick={() => {
                  setConfirmationDialogIsOpen(true);
                }}
                className="text-primary"
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
    </>
  );
};

export default Dashboard;
