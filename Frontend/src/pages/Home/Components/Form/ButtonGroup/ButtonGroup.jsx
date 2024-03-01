import "./buttongroup.css";
const ButtonGroup = ({ icon, buttonText }) => {
  return (
    <div className="btn_row d-flex justify-between px-3 gap-md-1">
      <a href="/login">
        <img src={icon} alt="" className="" />
      </a>

      <button className="text-sm">{buttonText}</button>
    </div>
  );
};

export default ButtonGroup;
