const Login = ({}) => {
  return (
    <>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">Sign-in Email</span>
        </label>
        <input
          type="text"
          placeholder="Email Address"
          className="input input-bordered w-full max-w-xs"
        />
      </div>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">Password</span>
        </label>
        <input
          type="password"
          placeholder="Password"
          className="input input-bordered w-full max-w-xs"
        />
      </div>
    </>
  );
}

export default Login