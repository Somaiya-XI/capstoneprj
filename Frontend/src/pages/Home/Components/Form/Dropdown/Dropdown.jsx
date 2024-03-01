import { useState } from "react";
import "./dropdown.css";
import { IoMdArrowDropdown } from "react-icons/io";
const Dropdown = ({
  options,
  hasInput,
  dropButtonClasses,
  dropMainClasses,
  dropContentClasses,
  as,
}) => {
  const [drop, setDrop] = useState(options[0]);
  const [show, setShow] = useState(false);

  const handleDropChange = (option) => {
    setDrop(option);
    setShow(false);
  };

  return (
    <div className={`dropdown ${dropMainClasses}`}>
      <button
        onClick={() => setShow(!show)}
        className={`dropbtn d-flex align-items-center justify-center ${dropButtonClasses}`}
      >
        {drop} <IoMdArrowDropdown />
      </button>
      <ul
        id="myDropdown"
        className={`dropdown-content ${show && "show"} ${dropContentClasses}`}
      >
        {hasInput && <input type="text" autoFocus className="outline-none" />}
        {as === "options"
          ? options.map((opt, index) => {
              return (
                <li key={index} onClick={() => handleDropChange(opt)}>
                  {opt}
                </li>
              );
            })
          : options.map((opt, index) => {
              return (
                <a href="#" key={index}>
                  {opt}
                </a>
              );
            })}
      </ul>
    </div>
  );
};
export default Dropdown;
