import './Header.css';
import earth from '../../images/earth.png';
import {Link} from 'react-router-dom';

const Header = ({children}) => {
  return (
    <div id='c'>
      <div id='header'>
        <div id='f-section'>
          <Link to='/'>
            <span className='text-[#eeeeee] hover:text-zinc-300'>About Us</span>
          </Link>
          <span className='text-[#eeeeee] mx-3'>|</span>
          <Link to='/'>
            <span className='text-[#eeeeee] hover:text-zinc-300'>Support</span>
          </Link>
        </div>
        <div id='s-section'>
          <Iconify-icon
            className='inline'
            icon='gravity-ui:planet-earth'
            width='16'
            height='16'
            style={{color: ' #eeeeee'}}
          />
          <p id='para' className='text-[#eeeeee]'>English</p>
        </div>
      </div>
      {children}
    </div>
  );
};

export default Header;
