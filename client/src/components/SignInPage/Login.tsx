import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { signInUser } from "../../features/user/userSlice";
import LoadingSpinner from "../Reusable/LoadingSpinner";
import Dashboard from "../Dashboard/Dashboard";
import WarningDialog from "../Reusable/WarningDialog";

const EMAIL_REGEX =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const Login = ({}) => {
  // Global states in Redux
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.user.loading);

  // Local states & refs & variables
  const emailRef = useRef<HTMLInputElement | null>(null);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [password, setPassword] = useState("");

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
    setErrMsg("");
  }, [email, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const verification1 = EMAIL_REGEX.test(email);
    if (!verification1) {
      setErrMsg("Invalid Entry");
      return;
    }

    try {
      const action = await dispatch(signInUser({ email, password }));

      if (signInUser.rejected.match(action)) {
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
    } catch (error) {
      console.error("An error occurred while dispatching signInUser:", error);
    }

    setSuccess(true);
    setEmail("");
    setPassword("");
  };
  return (
    <>
      {success ? (
        <Dashboard />
      ) : (
        <div className="form-control w-full max-w-xs">
          <WarningDialog
            isOpen={warningDialogIsOpen}
            onConfirm={() => {
              setWarningDialogIsOpen(false);
              setPassword("");
            }}
            text={errMsg}
          />
          <form
            action="/submit-form"
            onSubmit={handleSubmit}
            autoComplete="off"
            className="pt-10"
          >
            <div>
              <label htmlFor="email" className="label">
                <span className="label-text">Sign-in Email</span>
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
            <div>
              <label htmlFor="password" className="label mt-3">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="input input-bordered w-full max-w-xs"
                required
              />
            </div>
            {loading ? (
              <button
                type="submit"
                className="btn btn-primary w-full max-w-xs mt-6"
              >
                <LoadingSpinner size={"md"} colour={"neutral-content"} />
              </button>
            ) : (
              <button
                type="submit"
                className="btn btn-primary w-full max-w-xs mt-6"
              >
                Sign In
              </button>
            )}
          </form>
        </div>
      )}
    </>
  );
};

export default Login;
