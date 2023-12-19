import { useNavigate } from "react-router-dom";
import Login from "./Login";

const SignInPage = () => {
const navigate = useNavigate();

  return (
    <div className="flex flex-col w-full">
      <div className="grid card rounded-box place-items-center">
        <Login />
      </div>
      <div className="divider"></div>
      <div className="grid card rounded-box place-items-center">
        <button
          className="btn btn-secondary w-full max-w-xs"
          onClick={() => navigate("/signup")}
        >
          Create New User
        </button>
      </div>
    </div>
  );
}

export default SignInPage;