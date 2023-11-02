import Login from "./Login";
import { MouseEvent } from "react";

interface Props {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  showAdd: boolean
}

const SignInPage: React.FC<Props> = ({onClick, showAdd}) => {
  return (
    <div className="flex flex-col w-full">
      <div className="grid card rounded-box place-items-center">
        <Login />
      </div>
      <div className="divider"></div>
      <div className="grid card rounded-box place-items-center">
        <button
          className="btn btn-secondary w-full max-w-xs"
          onClick={onClick}
        >
          Create New User
        </button>
      </div>
    </div>
  );
}

export default SignInPage;