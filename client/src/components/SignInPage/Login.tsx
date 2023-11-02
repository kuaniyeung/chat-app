const Login = ({}) => {
  return (
    <>
      <form className="form-control w-full max-w-xs">
        <div>
          <label className="label">
            <span className="label-text">Sign-in Email</span>
          </label>
          <input
            type="text"
            placeholder="Email Address"
            className="input input-bordered w-full max-w-xs"
          />
        </div>
        <div>
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            type="password"
            placeholder="Password"
            className="input input-bordered w-full max-w-xs"
          />
        </div>
        <button className="btn btn-primary w-full max-w-xs mt-6">
          Sign In
        </button>
      </form>
    </>
  );
}

export default Login