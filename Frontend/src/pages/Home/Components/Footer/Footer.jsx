import "./Footer.css";
import logo from "../../images/WiseRW.png";
import icon1 from "../../images/facebook.png";
import icon2 from "../../images/twitter.png";
import icon3 from "../../images/instagram.png";
import icon4 from "../../images/pinterest.png";
import icon5 from "../../images/youtube.png";

const Footer = () => {
  return (
    <div id="footer">
      <div id="fSection">
        <img id="iimg" src={logo} />
      </div>
      <div id="sSection">
        <p id="paraghraps">
          WiseR Technologies © 2024 <br></br> Terms and Service &nbsp;&nbsp;
          Privacy Policy
        </p>
      </div>
      <div id="thSection">
        <p id="paraghraps2">Follow Us</p>
        <img id="iimg" src={icon1} />
        <img id="iimg" src={icon2} />
        <img id="iimg" src={icon3} />
        <img id="iimg" src={icon4} />
        <img id="iimg" src={icon5} />
      </div>
    </div>
  );
};

export default Footer;
