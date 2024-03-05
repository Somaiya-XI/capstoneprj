import InputGroup from '../Form/InputGroup/InputGroup';
import logo from '../../images/WiseR2.png';
import iconUser from '../../images/user.png';
import CartIcon from '../../images/cart.png';
import ButtonGroup from '../Form/ButtonGroup/ButtonGroup';
import './navbar.css';
import {useContext} from 'react';
import {UserContext} from '../../../../Contexts';
const Navbar = ({children}) => {
  const options = ['Your Location', 'New york', 'albania'];
  const {role} = useContext(UserContext);

  return (
    <>
      <div className='row navWeb pt-4 pb-4'>
        <div className='col-md-12 d-flex align-items-center justify-between'>
          <div className='logo'>
            <img src={logo} alt='' />
          </div>
          <InputGroup />
          <div className='button_group '>
            <ButtonGroup icon={iconUser} buttonText={'Login'} link='/login' />
            <div className='divider'></div>
            <ButtonGroup icon={iconUser} buttonText={'Sign Up'} link='/register' />
            <div className='divider'></div>

            {role === 'RETAILER' && <ButtonGroup icon={CartIcon} buttonText={'  Cart'} link='/cart' />}
          </div>
        </div>
      </div>
      {children}
    </>
  );
};

export default Navbar;
