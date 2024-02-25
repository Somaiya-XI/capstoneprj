import InputGroup from "../Form/InputGroup/InputGroup";
import logo from "../../images/WiseR2.png";
import iconUser from "../../images/user.png";
import ButtonGroup from "../Form/ButtonGroup/ButtonGroup";
import "./navbar.css";

const Navbar = () => {
  const options = ["Your Location", "New york", "albania"];
  return (
    <div className="row navWeb pt-4 pb-4">
      <div className="col-md-12 d-flex align-items-center justify-between">
        <div className="logo">
          <img src={logo} alt="" />
        </div>
        <InputGroup />
        <div className="button_group ">
          <ButtonGroup icon={iconUser} buttonText={"Login"} />
          <div className="divider"></div>
          <ButtonGroup icon={iconUser} buttonText={"Sign Up"} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
