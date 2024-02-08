import "./ListGroup.css";
import ProfileImage from "../ProfileImage/ProfileImage.jsx";
import Labels from "../Labels/Labels.jsx";
import ChangePassword from "../ChangePassword/ChangePassword.jsx";
import { useState } from "react";
import axios from "axios";
import React from "react";

/* function ListGroup() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      console.log(import.meta.env.VITE_API_URL);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}user`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        console.log(result);
        setData(result);
        console.log(data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    }
    fetchData();
  }, data);

  return (
    <>
      <div className="container">
        <div className="list-container">
          <ul className="list">
            <li className="list-item">Profile</li>
            <li className="list-item">Change Password</li>
          </ul>
        </div>
        <div className="info-container">
          <ProfileImage image={data.profile_picture} />
          <Labels label1={"Company Name"} label2={data[1].company_name} />
          <Labels label1={"Email"} label2={data[1].email} />
          <Labels label1={"Phone Number"} label2={"+966 " + data[1].phone} />
          <Labels label1={"Address"} label2={"l"} />
          <ChangePassword /> 
        </div>
      </div>
    </>
  );
}

export default ListGroup;
 */

class ListGroup extends React.Component {
  state = { details: [], flag: 1 };

  componentDidMount() {
    let data;
    axios
      .get(`${import.meta.env.VITE_API_URL}api2`)
      .then((res) => {
        data = res.data;
        this.setState({
          details: data,
        });
      })
      .catch((err) => {});
  }

  render() {
    return (
      <div>
        <div className="container">
          <div className="list-container">
            <ul className="list">
              <li
                className={
                  this.state.flag === 1 ? "list-item list-item2" : "list-item"
                }
                onClick={() => {
                  this.setState({
                    flag: 1,
                  });
                }}
              >
                Profile
              </li>
              <li
                className={
                  this.state.flag === 2 ? "list-item list-item2" : "list-item"
                }
                onClick={() => {
                  this.setState({
                    flag: 2,
                  });
                }}
              >
                Change Password
              </li>
            </ul>
          </div>
          {this.state.flag === 1 ? (
            this.state.details.map((output, id) =>
              id === 1 ? (
                <div key={id} className="info-container">
                  <ProfileImage image={output.profile_picture} />
                  <Labels
                    label1={"Company Name"}
                    label2={output.company_name}
                  />
                  <Labels label1={"Email"} label2={output.email} />
                  <Labels label1={"Phone Number"} label2={output.phone} />
                  <Labels label1={"Address"} label2={output.address} />
                </div>
              ) : null
            )
          ) : (
            <div className="info-container">
              <ChangePassword />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default ListGroup;
