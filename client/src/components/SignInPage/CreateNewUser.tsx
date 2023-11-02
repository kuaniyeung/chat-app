import { useRef, useState, useEffect } from "react";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { addUser } from "../../SupabasePlugin";

interface Props {
  closeAdd: Function;
}

const EMAIL_REGEX =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const CreateNewUser: React.FC<Props> = ({ closeAdd }) => {
  const emailRef = useRef<HTMLInputElement | null>(null);
  const errRef = useRef<HTMLInputElement | null>(null);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [matchPassword, setMatchPassword] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
    setValidMatch(password === matchPassword);
  }, [password, matchPassword]);

  useEffect(() => {
    setErrMsg("");
  }, [email, password, matchPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const verification1 = PWD_REGEX.test(password);
    const verification2 = EMAIL_REGEX.test(email);
    if (!verification1 || !verification2) {
      setErrMsg("Invalid Entry");
      return;
    }

    try {
      await addUser(email, password);
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
    setMatchPassword("");
  };

  return (
    <>
      {success ? (
        <section>
          <h1>Success!</h1>
        </section>
      ) : (
        <div className="fixed top-0 left-0 right-0 w-full h-full bg-base-300">
          <p
            ref={errRef}
            className={errMsg ? "" : "invisible"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <form
            action="/submit-form"
            onSubmit={handleSubmit}
            className="place-items-center flex flex-col z-10 px-8 p-10"
            autoComplete="off"
          >
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
                placeholder="example: youremail@gmail.com"
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

            <div className="form-control w-full max-w-xs">
              <label htmlFor="confirm-password" className="label">
                <span className="label-text">Confirm New Password</span>
                <FontAwesomeIcon
                  icon={faCheck}
                  className={validMatch && matchPassword? "text-success" : "hidden"}
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
                <FontAwesomeIcon icon={faInfoCircle} /> Must match the first password input field.
              </p>
            </div>
            <button
              type="submit"
              className="btn btn-secondary form-control w-full max-w-xs my-3"
              disabled={!validPassword || !validMatch ? true : false}
            >
              Create User
            </button>
            <button className="btn btn-outline form-control w-full max-w-xs" onClick={(e)=> closeAdd(e)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default CreateNewUser;
