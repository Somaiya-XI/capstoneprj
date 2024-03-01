import Dropdown from "../Form/Dropdown/Dropdown";
import "./navbar.css";
import { category } from "./Constants";

const NavbarMega = () => {
  return (
    <div className="row">
      <div className="col-md-12 d-flex justify-between align-items-center">
        <div
          className="nav_links d-flex align-items-center gap-10"
          id="nav_links"
        >
          <Dropdown options={category} />
          <Dropdown options={category} />
          <Dropdown options={category} />
          <Dropdown options={category} />
          <Dropdown options={category} />
          <Dropdown options={category} />
        </div>
      </div>
    </div>
  );
};
export default NavbarMega;
