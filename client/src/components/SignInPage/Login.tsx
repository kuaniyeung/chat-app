import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { signInUser } from "../../features/user/userSlice";
import LoadingSpinner from "../LoadingSpinner";
import Dashboard from "../Dashboard/Dashboard";

const EMAIL_REGEX =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const Login = ({}) => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.user.loading);

  const emailRef = useRef<HTMLInputElement | null>(null);
  const errRef = useRef<HTMLInputElement | null>(null);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [password, setPassword] = useState("");

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

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
      await dispatch(signInUser({ email, password }));
    } catch (error) {
      if (error instanceof Error && "message" in error) {
        setErrMsg(error.message);
      } else {
        console.error("An unknown error occurred.");
      }
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
          <p ref={errRef} className={errMsg ? "" : "invisible"}>
            {errMsg}
          </p>
          <form
            action="/submit-form"
            onSubmit={handleSubmit}
            autoComplete="off"
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
              <label htmlFor="password" className="label">
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
                <LoadingSpinner colour={"neutral-content"} />
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
