import "./ProfileImage.css";
import { useState } from "react";
import axios from "axios";

const ProfileImage = ({ image }) => {
  const id = "3";
  const [flag, setFlag] = useState(1);
  const [values, setValues] = useState({
    profile_picture: null,
  });

  const { profile_picture } = values;

  const update = () => {
    const formData = new FormData();
    formData.append("profile_picture", profile_picture);
    return axios({
      method: "PUT",
      url: `${import.meta.env.VITE_API_URL}user/update/${id}/`,
      data: formData,
    })
      .then((response) => {
        return response;
      })
      .catch((err) => console.log(err));
  };

  const handleChange = () => (event) => {
    const img = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setValues({
        ...values,
        profile_picture: reader.result,
      });
    };

    if (img) {
      reader.readAsDataURL(img);
    }
  };

  const onSubmit = () => (event) => {
    event.preventDefault();
    setValues({ ...values });
    update()
      .then((data) => {
        console.log("Data", data);
      })
      .catch((e) => console.log(e));
    setFlag(1);
  };

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
              <input type="file" className="image" onChange={handleChange()} />
            </center>
            <button
              type="button"
              onClick={onSubmit()}
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
