import './Header.css';
import earth from '../../images/earth.png';
import {Link} from 'react-router-dom';

const Header = ({children}) => {
  return (
    <div id='c'>
      <div id='header'>
        <div id='f-section'>
          <Link to='/'>
            <a id='link'>About Us</a>
          </Link>
          <span id='customDivider'>|</span>
          <a id='link'>Order Tracking</a>
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
