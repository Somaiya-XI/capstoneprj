import "./ProfileImage.css";
import { useState } from "react";

const ProfileImage = ({ image }) => {
  const [flag, setFlag] = useState(1);

  return (
    <>
      <div className="image-container">
        {flag === 1 ? (
          <>
            <center>
              <img src={image} className="image" />
            </center>
            <button
              type="button"
              onClick={() => setFlag(2)}
              className="btn btn-success bt"
            >
              Change
            </button>
          </>
        ) : (
          <>
            <center>
              <input type="file" className="image" />
            </center>
            <button
              type="button"
              onClick={() => setFlag(1)}
              className="btn btn-success bt"
            >
              Confirm
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default ProfileImage;
