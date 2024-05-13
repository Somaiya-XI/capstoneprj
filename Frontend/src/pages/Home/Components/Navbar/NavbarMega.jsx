import Dropdown from "../Form/Dropdown/Dropdown";
import "./navbar.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "@/backend";


const NavbarMega = () => {
  const [categories, setCategories] = useState([]);

  const loadCategories = async () => {
    const { data } = await axios.get(
      `${API}product/catalog-product/get-categories/`
    );
    setCategories(data);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div className="row">
      <div className="col-md-12 d-flex justify-between align-items-center">
        <div
          className="nav_links d-flex align-items-center gap-10"
          id="nav_links"
        >
          {categories.map((category, index) => (
            <Dropdown options={[category]} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};
export default NavbarMega;
