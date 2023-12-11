import { useRef, useState, useEffect } from "react";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { createUser } from "../../features/user/userSlice";
import LoadingSpinner from "../Reusable/LoadingSpinner";
import Dashboard from "../Dashboard/Dashboard";
import WarningDialog from "../Reusable/WarningDialog";

interface Props {
  closeAdd: Function;
}

const EMAIL_REGEX =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const DISPLAY_NAME_REGEX = /^.{3,70}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const CreateNewUser: React.FC<Props> = ({ closeAdd }) => {
  // Global states in Redux
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.user.loading);

  // Local states & refs & variables
  const emailRef = useRef<HTMLInputElement | null>(null);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [displayName, setDisplayName] = useState("");
  const [validDisplayName, setValidDisplayName] = useState(false);
  const [displayNameFocus, setDisplayNameFocus] = useState(false);

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [matchPassword, setMatchPassword] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState<string | undefined>("");
  const [success, setSuccess] = useState(false);
  const [warningDialogIsOpen, setWarningDialogIsOpen] =
    useState<boolean>(false);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    setValidDisplayName(DISPLAY_NAME_REGEX.test(displayName));
  }, [displayName]);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
    setValidMatch(password === matchPassword);
  }, [password, matchPassword]);

  useEffect(() => {
    setErrMsg("");
  }, [email, password, matchPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const verification1 = EMAIL_REGEX.test(email);
    const verification2 = DISPLAY_NAME_REGEX.test(displayName);
    const verification3 = PWD_REGEX.test(password);
    if (!verification1 || !verification2 || !verification3) {
      setErrMsg("Invalid Entry");
      return;
    }

    try {
      const action = await dispatch(
        createUser({ displayName, email, password })
      );

      if (createUser.rejected.match(action)) {
        const error = action.payload as { message?: string };

        if (error && "message" in error) {
          setErrMsg(error.message);
          setWarningDialogIsOpen(true);
          setSuccess(false);
          return;
        }
        console.error("An unknown error occurred.");
        setErrMsg("An unknown error occurred.");
      }

      setSuccess(true);
      setEmail("");
      setDisplayName("");
      setPassword("");
      setMatchPassword("");
      closeAdd();
    } catch (error) {
      console.error("An error occurred while dispatching createUser:", error);
    }
  };

  return (
    <>
      {success ? (
        <Dashboard />
      ) : (
        <div className="fixed top-0 left-0 right-0 w-full h-full bg-base-300">
          <WarningDialog
            isOpen={warningDialogIsOpen}
            onConfirm={() => {
              setWarningDialogIsOpen(false);
              setEmail("");
              setDisplayName("");
              setPassword("");
              setMatchPassword("");
            }}
            text={errMsg}
          />
          <form
            action="/submit-form"
            onSubmit={handleSubmit}
            className="place-items-center flex flex-col z-10 px-8 p-10"
            autoComplete="off"
          >
            {/* Email Entry */}

            <div className="form-control w-full max-w-xs">
              <label htmlFor="email" className="label">
                <span className="label-text">Email Address</span>
                <FontAwesomeIcon
                  icon={faCheck}
                  className={validEmail ? "text-success" : "hidden"}
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  className={validEmail || !email ? "hidden" : "text-error"}
                />
              </label>
              <input
                type="email"
                ref={emailRef}
                placeholder="example: youremail@mail.com"
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

            {/* Display Name Entry */}

            <div className="form-control w-full max-w-xs">
              <label htmlFor="displayName" className="label">
                <span className="label-text">Display Name</span>
                <FontAwesomeIcon
                  icon={faCheck}
                  className={validDisplayName ? "text-success" : "hidden"}
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  className={
                    validDisplayName || !displayName ? "hidden" : "text-error"
                  }
                />
              </label>
              <input
                type="text"
                placeholder="Your display name"
                onChange={(e) => setDisplayName(e.target.value)}
                value={displayName}
                autoComplete="off"
                className="input input-bordered w-full max-w-xs"
                required
                onFocus={() => setDisplayNameFocus(true)}
                onBlur={() => setDisplayNameFocus(false)}
              />
              <p
                className={
                  displayNameFocus && displayName && !validDisplayName
                    ? "text-xs p-2 m-2 bg-warning rounded-lg"
                    : "hidden"
                }
              >
                <FontAwesomeIcon icon={faInfoCircle} /> Must be over 2 and less
                than 70 characters.
              </p>
            </div>

            {/* Password Entry */}

            <div className="form-control w-full max-w-xs">
              <label htmlFor="password" className="label">
                <span className="label-text">New Password</span>
                <FontAwesomeIcon
                  icon={faCheck}
                  className={validPassword ? "text-success" : "hidden"}
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  className={
                    validPassword || !password ? "hidden" : "text-error"
                  }
                />
              </label>
              <input
                type="password"
                placeholder="Between 8 to 24 characters"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="input input-bordered w-full max-w-xs"
                required
                onFocus={() => setPasswordFocus(true)}
                onBlur={() => setPasswordFocus(false)}
              />
              <p
                className={
                  passwordFocus && !validPassword
                    ? "text-xs p-2 m-2 bg-warning rounded-lg"
                    : "hidden"
                }
              >
                <FontAwesomeIcon icon={faInfoCircle} /> 8 to 24 characters.
                <br />
                Must include uppercase and lowercase letters, a number and a
                special character.
                <br />
                Allowed special characters:{" "}
                <span aria-label="exclamation mark">!</span>{" "}
                <span aria-label="at symbol">@</span>{" "}
                <span aria-label="hashtag">#</span>{" "}
                <span aria-label="dollar sign">$</span>{" "}
                <span aria-label="percent">%</span>
              </p>
            </div>

            {/* Confirm Password Entry */}

            <div className="form-control w-full max-w-xs">
              <label htmlFor="confirm-password" className="label">
                <span className="label-text">Confirm New Password</span>
                <FontAwesomeIcon
                  icon={faCheck}
                  className={
                    validMatch && matchPassword ? "text-success" : "hidden"
                  }
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  className={
                    validMatch || !matchPassword ? "hidden" : "text-error"
                  }
                />
              </label>
              <input
                type="password"
                placeholder="Confirm password"
                onChange={(e) => setMatchPassword(e.target.value)}
                value={matchPassword}
                className="input input-bordered w-full max-w-xs"
                required
                onFocus={() => setMatchFocus(true)}
                onBlur={() => setMatchFocus(false)}
              />
              <p
                className={
                  matchFocus && !validMatch
                    ? "text-xs p-2 m-2 bg-warning rounded-lg"
                    : "hidden"
                }
              >
                <FontAwesomeIcon icon={faInfoCircle} /> Must match the first
                password input field.
              </p>
            </div>
            {loading ? (
              <button
                type="submit"
                className="btn btn-secondary form-control w-full max-w-xs my-3"
                disabled={!validPassword || !validMatch ? true : false}
              >
                <LoadingSpinner size={"md"} colour={"neutral-content"} />
              </button>
            ) : (
              <button
                type="submit"
                className="btn btn-secondary form-control w-full max-w-xs my-3"
                disabled={!validPassword || !validMatch ? true : false}
              >
                Create User
              </button>
            )}
            <button
              className="btn btn-outline form-control w-full max-w-xs"
              onClick={(e) => closeAdd(e)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default CreateNewUser;
