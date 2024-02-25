import "./ChangePassword.css";

const ChangePassword = () => {
  return (
    <>
      <div className="change-password-container">
        <h2>Change Password</h2>
        <br></br>
        <div className="password-cotainer">
          <label htmlFor="password" className="label">
            Old Password
          </label>
          <input type="password" id="input" />
        </div>
        <div className="password-cotainer">
          <label htmlFor="password" className="label">
            New Password
          </label>
          <input type="password" id="input" />
        </div>
        <div className="password-cotainer">
          <label htmlFor="password" className="label">
            Confirm Password
          </label>
          <input type="password" id="input" />
        </div>
        <div className="bt2-container">
          <button type="button" className="btn btn-success bt2">
            Change
          </button>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
