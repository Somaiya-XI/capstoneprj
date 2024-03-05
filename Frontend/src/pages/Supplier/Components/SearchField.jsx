import React from 'react';
import "./Supplier.css";
import SearchLogo from "./Search.png"

const SearchField = () => {
  return (
    <div className="w-100 input_group">
    <div className=" d-flex p-2 gap-4">
        <div className="input ml-2">
            <div id="logoSearch">
                <img src={SearchLogo} alt="" className="" />
            </div>
            <div id="logoSearch">
                <input
                    type="text"
                    placeholder="Search .."
                    className="w-100 outline-none"
                />
            </div>
        </div>
    </div>
</div>
  )
}

export default SearchField
