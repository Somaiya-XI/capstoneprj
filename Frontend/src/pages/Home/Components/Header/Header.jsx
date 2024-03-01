import "./Header.css";
import earth from "../../images/earth.png";

const Header = () => {
  return (
    <div id="header">
      <div id="f-section">
        <a id="link">About Us</a>
        <span id="customDivider">|</span>
        <a id="link">Order Tracking</a>
      </div>
      <div id="s-section">
        <img id="iimg" src={earth} />
        <p id="para">English</p>
      </div>
    </div>
  );
};

export default Header;
