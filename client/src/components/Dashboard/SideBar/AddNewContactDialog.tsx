import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { addNewContact } from "../../../features/contact/ContactSlice";
import WarningDialog from "../../Dialogs/WarningDialog";
import LoadingSpinner from "../../LoadingSpinner";

interface Props {
  isOpen: boolean;
  closeAdd: Function;
}


const AddNewContactDialog: React.FC<Props> = ({ isOpen, closeAdd }) => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.contact.loading);

  const displayNameRef = useRef<HTMLInputElement | null>(null);

  const [displayName, setDisplayName] = useState("");
  const [displayNameFocus, setDisplayNameFocus] = useState(false);

  const [errMsg, setErrMsg] = useState<string | undefined>("");
  const [warningDialogIsOpen, setWarningDialogIsOpen] =
    useState<boolean>(false);

  useEffect(() => {
    displayNameRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const action = await dispatch(addNewContact({ displayName }));

      if (addNewContact.rejected.match(action)) {
        const error = action.payload as { message?: string };

        if (error && "message" in error) {
          setErrMsg(error.message);
          setWarningDialogIsOpen(true);
          return;
        }
        console.error("An unknown error occurred.");
        setErrMsg("An unknown error occurred.");
      }
    } catch (error) {
      console.error("An error occurred while dispatching signInUser:", error);
    }

    setDisplayName("")
    closeAdd();
  };

  return (
    <>
      <dialog
        id="my_modal_5"
        className={`modal sm:modal-middle ${isOpen ? "modal-open" : ""}`}
      >
        <div className="modal-box form-control w-full max-w-xs">
          <WarningDialog
            isOpen={warningDialogIsOpen}
            onConfirm={() => {
              setWarningDialogIsOpen(false);
              setDisplayName("");
            }}
            text={errMsg}
          />
          <form
            action="/submit-form"
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            <div>
              <label htmlFor="display_name" className="label">
                <span className="label-text">Contact Display Name</span>
              </label>
              <input
                type="text"
                ref={displayNameRef}
                placeholder="Enter Display Name"
                onChange={(e) => setDisplayName(e.target.value)}
                value={displayName}
                autoComplete="off"
                className="input input-bordered w-full max-w-xs"
                required
                onFocus={() => setDisplayNameFocus(true)}
                onBlur={() => setDisplayNameFocus(false)}
              />
            </div>

            {loading ? (
              <button
                type="submit"
                className="btn btn-primary w-full max-w-xs mt-6"
              >
                <LoadingSpinner colour={"neutral-content"} />
              </button>
            ) : (
              <button
                type="submit"
                className="btn btn-primary w-full max-w-xs mt-6"
              >
                Add Contact
              </button>
            )}
          </form>
          <button
            className="btn btn-outline form-control w-full max-w-xs mt-4"
            onClick={(e) => closeAdd(e)}
          >
            Cancel
          </button>
        </div>
      </dialog>
    </>
  );
};

export default AddNewContactDialog;
