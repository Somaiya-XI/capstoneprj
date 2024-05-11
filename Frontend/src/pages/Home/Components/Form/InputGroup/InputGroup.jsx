import "./inputgroup.css";
import logo from "../../../images/Search.png";
import { useState, useEffect } from "react";

const InputGroup = (handleChange) => {

  return (
    <div className="w-100 input_group">
      <div className=" d-flex p-2 gap-4">
        <div className="input ml-2">
          <div id="logoSearch">
            <img src={logo} alt="" className="" />
          </div>
          <div id="logoSearch">
            <input
              type="text"
              placeholder="Search for items"
              className="w-100 outline-none"
              // value={searchInput}
              defaultValue={"kk"}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default InputGroup;
