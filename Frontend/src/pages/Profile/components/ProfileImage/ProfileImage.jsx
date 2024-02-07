//import image from "../../images/image.webp";
import "./ProfileImage.css";

const ProfileImage = ({ image }) => {
  return (
    <>
      <div className="image-container">
        <center>
          <img src={image} className="image" />
        </center>
        <button type="button" className="btn btn-success bt">
          Change
        </button>
      </div>
    </>
  );
};

export default ProfileImage;
