import {NavLink} from 'react-router-dom';
import './buttongroup.css';

const ButtonGroup = ({icon, buttonText, link = '#', onClick, width = '24', height = '24'}) => {
  // Absolutely cheap way but for now it's my only option ┗( T﹏T )┛
  const renderIcon = () => {
    if (typeof icon === 'string') {
      if (icon.includes(':')) {
        if (onClick) {
          return (
            <Iconify-icon
              inline
              icon={icon}
              onClick={onClick}
              width={width}
              height={height}
              style={{color: '#8fdb6f'}}
            ></Iconify-icon>
          );
        } else {
          return (
            <Iconify-icon inline icon={icon} width={width} height={height} style={{color: '#8fdb6f'}}></Iconify-icon>
          );
        }
      } else if (icon.includes('/') || icon.includes('.')) {
        if (onClick) {
          return <img src={icon} alt='' className='' onClick={onClick} />;
        } else {
          return <img src={icon} alt='' className='' />;
        }
      }
    }
    return null;
  };
  return (
    <div className='btn_row d-flex justify-between px-3 gap-md-1'>
      {onClick ? (
        <>
          <NavLink to={link} onClick={onClick}>
            {renderIcon()}
          </NavLink>
          <NavLink to={link}>
            <button className='text-sm' onClick={onClick}>
              {buttonText}
            </button>
          </NavLink>
        </>
      ) : (
        <>
          <NavLink to={link}>{renderIcon()}</NavLink>
          <NavLink to={link}>
            <button className='text-sm'>{buttonText}</button>
          </NavLink>
        </>
      )}
    </div>
  );
};

export default ButtonGroup;
