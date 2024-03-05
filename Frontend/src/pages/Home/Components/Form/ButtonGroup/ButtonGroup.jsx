import {NavLink} from 'react-router-dom';
import './buttongroup.css';
const ButtonGroup = ({icon, buttonText, link}) => {
  return (
    <div className='btn_row d-flex justify-between px-3 gap-md-1'>
      <NavLink to={link}>
        <img src={icon} alt='' className='' />
      </NavLink>
      <NavLink to={link}>
        <button className='text-sm'>{buttonText}</button>
      </NavLink>
    </div>
  );
};

export default ButtonGroup;
