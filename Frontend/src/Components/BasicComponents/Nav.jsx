import InputGroup from '../../pages/Home/Components/Form/InputGroup/InputGroup';
import iconUser from '../../pages/Home/images/user.png';

import './navbar.css';
import {Link} from 'react-router-dom';
import Header from '../../pages/Home/Components/Header/Header';
import {useCsrfContext, useUserContext} from '../../Contexts';
import ButtonGroup from '../../pages/Home/Components/Form/ButtonGroup/ButtonGroup';
import {ProfileSheet} from '../FormComponents/CompleteProfile';

const SearchNav = ({children}) => {
  const {user} = useUserContext();
  const {logUserOut, isAuthenticated} = useCsrfContext();

  return (
    <>
      <div id='c'>
        <Header />
        <div id='c' className='md:container md:mx-auto mt-5'>
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
                    <ButtonGroup
                      icon='carbon:dashboard'
                      buttonText={'Dashboard'}
                      link='/retailer-dashboard/my-products'
                    />
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
                {isAuthenticated && user.role === 'UNDEFIEND' && (
                  <>
                    <ProfileSheet></ProfileSheet>
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
        </div>
      </div>
      {children}
    </>
  );
};

export default SearchNav;

export const BasicNav = ({children}) => {
  const {user} = useUserContext();
  const {logUserOut, isAuthenticated} = useCsrfContext();

  return (
    <>
      <div id='c'>
        <Header />
        <div id='c' className='md:container md:mx-auto mt-5'>
          <div className='row navWeb pt-4 pb-4'>
            <div className='col-md-12 d-flex align-items-center justify-between'>
              <div className='logo'>
                <Link to='/'>
                  <p className='font-bold text-[#023c07] text-center text-4xl logo'>WiseR</p>
                </Link>
              </div>
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
                    <ButtonGroup
                      icon='carbon:dashboard'
                      buttonText={'Dashboard'}
                      link='/retailer-dashboard/my-products/'
                    />
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
                {isAuthenticated && user.role === 'UNDEFIEND' && (
                  <>
                    <ProfileSheet></ProfileSheet>
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
        </div>
      </div>
      {children}
    </>
  );
};
