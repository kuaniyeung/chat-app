import { Fragment } from "react";

interface Props {
  onAdd: Function;
  closeAdd: Function;
}

const CreateNewUser: React.FC<Props> = ({ onAdd, closeAdd }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    closeAdd();
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 w-full h-full bg-base-300">
        <form
          action="/submit-form"
          onSubmit={handleSubmit}
          className="w-full place-items-center flex flex-col z-10 px-8 p-10 xl:max-w-7xl"
          autoComplete="off"
        >
          <div className="form-control w-full max-w-xs">
            <label htmlFor="email" className="label">
              <span className="label-text">Email Address</span>
            </label>
            <input
              type="email"
              placeholder="example: youremail@gmail.com"
              className="input input-bordered w-full max-w-xs"
            />
          </div>
          <div className="form-control w-full max-w-xs">
            <label htmlFor="password" className="label">
              <span className="label-text">New Password</span>
            </label>
            <input
              type="password"
              placeholder="Password"
              className="input input-bordered w-full max-w-xs"
            />
          </div>
          <div className="form-control w-full max-w-xs">
            <label htmlFor="confirm-password" className="label">
              <span className="label-text">Confirm New Password</span>
            </label>
            <input
              type="password"
              placeholder="Password"
              className="input input-bordered w-full max-w-xs"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary form-control w-full max-w-xs my-3"
          >
            Create User
          </button>
          <button className="btn btn-outline form-control w-full max-w-xs">
            Cancel
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateNewUser;
