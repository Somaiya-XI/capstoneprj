import './Header.css';
import earth from '../../images/earth.png';
import {Link} from 'react-router-dom';

const Header = ({children}) => {
  return (
    <div id='c'>
      <div id='header'>
        <div id='f-section'>
          <Link to='/'>
            <span id='link'>About Us</span>
          </Link>
          <span id='customDivider'>|</span>
          <span id='link'>Order Tracking</span>
        </div>
        <div id='s-section'>
          <img id='iimg' src={earth} />
          <p id='para'>English</p>
        </div>
      </div>
      {children}
    </div>
  );
};

export default Header;
