import "./ListGroup.css";
import "../ProfileImage/ProfileImage.css";
import "../Labels/Labels.css";
import ChangePassword from "../ChangePassword/ChangePassword.jsx";
import { useUserContext } from "@/Contexts";
import { API } from "@/backend";
import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";


const ListGroup = () => {
  const { user } = useUserContext();
  const id = user.id;
  const [flag, setFlag] = useState(1);
  const [flags, setFlags] = useState({
    flag1: 1,
    flag2: 1,
    flag3: 1,
    flag4: 1,
    flag5: 1,
  });
  const [values, setValues] = useState({
    profile_picture: null,
    company_name: "",
    email: "",
    phone: "",
    address: "",
    error: [],
  });

  const [values2, setValues2] = useState({
    profile_picture: null,
    company_name: "",
    email: "",
    phone: "",
    address: "",
  });

  const { profile_picture, company_name, email, phone, address } = values2;

  const loadProfile = async () => {
    const { data } = await axios.get(
      `${API}user/${id}/`
    );
    setValues({
      ...values,
      profile_picture: data.profile_picture,
      company_name: data.company_name,
      email: data.email,
      phone: data.phone,
      address: data.address,
    });
    setValues2({ ...values2, profile_picture: data.profile_picture });
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const update = (user) => {
    const formData = new FormData();
    for (const name in user) {
      if (user[name] !== null && user[name].trim() !== "")
        formData.append(name, user[name]);
    }
    return axios({
      method: "PUT",
      url: `${API}user/update/${id}/`,
      data: formData,
    })
      .then((response) => {
        return response;
      })
      .catch((err) => console.log(err));
  };

  const handleChange = (name) => (event) => {
    if (name === "profile_picture") {
      const img = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setValues2({
          ...values2,
          profile_picture: reader.result,
        });
      };

      if (img) {
        reader.readAsDataURL(img);
      }
    } else {
      setValues2({
        ...values2,
        [name]: event.target.value,
      });
    }
  };

  const onSubmit = (user, flag) => (event) => {
    event.preventDefault();
    setValues({ ...values, error: [] });
    update(user)
      .then((data) => {
        if (Object.keys(data.data).length === 1) {
          if (data.data.hasOwnProperty("company_name")) {
            setValues({ ...values, error: data.data.company_name });
          } else if (data.data.hasOwnProperty("email")) {
            setValues({ ...values, error: data.data.email });
          } else if (data.data.hasOwnProperty("phone")) {
            setValues({ ...values, error: data.data.phone });
          } else if (data.data.hasOwnProperty("address")) {
            setValues({ ...values, error: data.data.address });
          }
          setValues2({
            ...values2,
            company_name: "",
            email: "",
            phone: "",
            address: "",
          });
        } else {
          for (const name in user) {
            if (name === "profile_picture")
              setValues({ ...values, profile_picture: profile_picture });
            else {
              setValues({
                ...values,
                company_name: data.data.company_name,
                email: data.data.email,
                phone: data.data.phone,
                address: data.data.address,
                error: [],
              });
            }
          }
        }
      })
      .catch((e) => console.log(e));
    setFlags({ ...flags, [flag]: 1 });
  };

  const errorMsg = () => {
    if (values.error.length === 0) {
      return null;
    }

    return (
      <div>
        {values.error.map((errorMsg, index) => (
          <p className="alert alert-danger" key={index}>
            {errorMsg}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="brand-wrapper"></div>
      {errorMsg()}
      <div className="container">
        <div className="list-container">
          <ul className="list">
            <li
              className={flag === 1 ? "list-item list-item2" : "list-item"}
              onClick={() => {
                setFlag(1);
              }}
            >
              Profile
            </li>
            <li
              className={flag === 2 ? "list-item list-item2" : "list-item"}
              onClick={() => {
                setFlag(2);
              }}
            >
              Change Password
            </li>
          </ul>
        </div>
        {flag === 1 ? (
          <div className="info-container">
            <div className="image-container">
              {flags.flag1 === 1 ? (
                <>
                  <center>
                    <img src={values.profile_picture} className="image" />
                  </center>
                  <button
                    type="button"
                    onClick={() => setFlags({ ...flags, flag1: 2 })}
                    className="btn btn-success bt"
                  >
                    Change
                  </button>
                </>
              ) : (
                <>
                  <center>
                    <input
                      type="file"
                      className="image"
                      onChange={handleChange("profile_picture")}
                    />
                  </center>
                  <button
                    type="button"
                    onClick={onSubmit({ profile_picture }, "flag1")}
                    className="btn btn-success bt"
                  >
                    Confirm
                  </button>
                </>
              )}
            </div>
            <div className="name-container">
              <label className="company-info" id="f-label">
                Company Name
              </label>
              {flags.flag2 === 1 ? (
                <>
                  <label className="company-info" id="s-label">
                    {values.company_name}
                  </label>
                  <div className="bt2-container">
                    <button
                      type="button"
                      onClick={() => setFlags({ ...flags, flag2: 2 })}
                      className="btn btn-success bt2"
                    >
                      Change
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <input
                    type="text" 
                    className="company-info"
                    id="input2"
                    defaultValue={values.company_name}
                    onChange={handleChange("company_name")}
                  />
                  <div className="bt2-container">
                    <button
                      type="button"
                      className="btn btn-success bt2"
                      onClick={onSubmit({ company_name }, "flag2")}
                    >
                      Confirm
                    </button>
                  </div>
                </>
              )}
            </div>
            <div className="name-container">
              <label className="company-info" id="f-label">
                Email
              </label>
              {flags.flag3 === 1 ? (
                <>
                  <label className="company-info" id="s-label">
                    {values.email}
                  </label>
                  <div className="bt2-container">
                    <button
                      type="button"
                      onClick={() => setFlags({ ...flags, flag3: 2 })}
                      className="btn btn-success bt2"
                    >
                      Change
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <input
                    type="email"
                    className="company-info"
                    id="input2"
                    defaultValue={values.email}
                    onChange={handleChange("email")}
                  />
                  <div className="bt2-container">
                    <button
                      type="button"
                      className="btn btn-success bt2"
                      onClick={onSubmit({ email }, "flag3")}
                    >
                      Confirm
                    </button>
                  </div>
                </>
              )}
            </div>
            <div className="name-container">
              <label className="company-info" id="f-label">
                Phone Number
              </label>
              {flags.flag4 === 1 ? (
                <>
                  <label className="company-info" id="s-label">
                    {values.phone}
                  </label>
                  <div className="bt2-container">
                    <button
                      type="button"
                      onClick={() => setFlags({ ...flags, flag4: 2 })}
                      className="btn btn-success bt2"
                    >
                      Change
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <input
                    type="tel"
                    className="company-info"
                    id="input2"
                    defaultValue={values.phone}
                    onChange={handleChange("phone")}
                  />
                  <div className="bt2-container">
                    <button
                      type="button"
                      className="btn btn-success bt2"
                      onClick={onSubmit({ phone }, "flag4")}
                    >
                      Confirm
                    </button>
                  </div>
                </>
              )}
            </div>
            <div className="name-container">
              <label className="company-info" id="f-label">
                Address
              </label>
              {flags.flag5 === 1 ? (
                <>
                  <label className="company-info" id="s-label">
                    {values.address}
                  </label>
                  <div className="bt2-container">
                    <button
                      type="button"
                      onClick={() => setFlags({ ...flags, flag5: 2 })}
                      className="btn btn-success bt2"
                    >
                      Change
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    className="company-info"
                    id="input2"
                    defaultValue={values.address}
                    onChange={handleChange("address")}
                  />
                  <div className="bt2-container">
                    <button
                      type="button"
                      className="btn btn-success bt2"
                      onClick={onSubmit({ address }, "flag5")}
                    >
                      Confirm
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="info-container">
            <ChangePassword />
          </div>
        )}
      </div>
    </div>
  );
};

export default ListGroup;
