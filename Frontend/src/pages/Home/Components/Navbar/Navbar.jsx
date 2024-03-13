import InputGroup from '../Form/InputGroup/InputGroup';
import logo from '../../images/WiseR2.png';
import iconUser from '../../images/user.png';
import CartIcon from '../../images/cart.png';
import ButtonGroup from '../Form/ButtonGroup/ButtonGroup';
import './navbar.css';
import {useContext} from 'react';
import {useUserContext, useCsrfContext} from '../../../../Contexts';
import {useEffect} from 'react';
import {Link} from 'react-router-dom';

const Navbar = ({children}) => {
  const options = ['Your Location', 'New york', 'albania'];
  const {user} = useUserContext();
  const {logUserOut, isAuthenticated} = useCsrfContext();

  return (
    <>
      <div className='row navWeb pt-4 pb-4'>
        <div className='col-md-12 d-flex align-items-center justify-between'>
          <div className='logo'>
            <Link to='/'>
              <img src={logo} alt='' />
            </Link>
          </div>
          <InputGroup />
          <div className='button_group '>
            {!isAuthenticated && (
              <>
                <ButtonGroup icon={iconUser} buttonText={'Login'} link='/login' />
                <div className='divider'></div>
                <ButtonGroup icon={iconUser} buttonText={'Register'} link='/register' />
              </>
            )}

            {isAuthenticated && user.role === 'RETAILER' && (
              <>
                <ButtonGroup icon='solar:cart-large-minimalistic-outline' buttonText={'  My Cart'} link='/cart' />
                <div className='divider'></div>
              </> // add to cart icon solar:cart-plus-outline solar:cart-large-2-bold-duotone solar:user-minus-broken
            )}

            {isAuthenticated && (
              <>
                <ButtonGroup icon='solar:user-minus-broken' buttonText={'  Logout'} link='/' onClick={logUserOut} />
              </>
            )}
          </div>
        </div>
      </div>
      {children}
    </>
  );
};

export default Navbar;
