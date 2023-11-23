import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { addNewContact } from "../../../features/contact/ContactSlice";
import WarningDialog from "../../Dialogs/WarningDialog";
import Dashboard from "../Dashboard";
import LoadingSpinner from "../../LoadingSpinner";

interface Props {
  isOpen: boolean;
  closeAdd: Function;
}

const EMAIL_REGEX =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const AddNewContactDialog: React.FC<Props> = ({ isOpen, closeAdd }) => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.contact.loading);

  const emailRef = useRef<HTMLInputElement | null>(null);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [errMsg, setErrMsg] = useState<string | undefined>("");
  const [warningDialogIsOpen, setWarningDialogIsOpen] =
    useState<boolean>(false);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
    setErrMsg("");
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const verification1 = EMAIL_REGEX.test(email);
    if (!verification1) {
      setErrMsg("Invalid Entry");
      return;
    }
    try {
      const action = await dispatch(addNewContact({ email }));

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
              setEmail('')
            }}
            text={errMsg}
          />
          <form
            action="/submit-form"
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            <div>
              <label htmlFor="email" className="label">
                <span className="label-text">Contact Email</span>
              </label>
              <input
                type="email"
                ref={emailRef}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                autoComplete="off"
                className="input input-bordered w-full max-w-xs"
                required
                onFocus={() => setEmailFocus(true)}
                onBlur={() => setEmailFocus(false)}
              />
              <p
                className={
                  emailFocus && email && !validEmail
                    ? "text-xs p-2 m-2 bg-warning rounded-lg"
                    : "hidden"
                }
              >
                <FontAwesomeIcon icon={faInfoCircle} /> Must be a valid email.
              </p>
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
