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
              <p className='font-bold text-[#023c07] text-center text-4xl logo'>WiseR</p>
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
                <ButtonGroup icon='carbon:dashboard' buttonText={'Dashboard'} link='/hardware-register' />
                <div className='divider'></div>
              </>
            )}
            {isAuthenticated && user.role === 'ADMIN' && (
              <>
                <ButtonGroup
                  icon='fluent:task-list-square-person-20-regular'
                  buttonText={'Users List'}
                  link='/user-activation'
                  width='28'
                  height='28'
                />
                <div className='divider'></div>
              </>
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
