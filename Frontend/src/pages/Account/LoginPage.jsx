import React, {useState, useEffect, useContext} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useUserContext, useCsrfContext} from '../../Contexts/index.jsx';
import axios from 'axios';
import './form.css';
import {API} from '../../backend';
import {logout, login, getUser} from './AuthHelpers';

const Login = () => {
  const {setUser, setRole} = useUserContext();
  const {getSession, getCsrfToken, isAuthenticated, setIsAuthenticated, csrf} = useCsrfContext();

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getSession();
  }, []);

  const handleChange = (name) => (event) => {
    if (name === 'email') {
      setEmail(event.target.value);
    } else if (name === 'password') {
      setPassword(event.target.value);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    login({email, password}, csrf)
      .then((response) => {
        console.log('DATA: ', response.data);
        setIsAuthenticated(true);
        setEmail('');
        setPassword('');
        setError('');
        setRole(response.data.role);
        setUser(response.data.user);
      })
      .catch((error) => {
        console.log('error occured', error.response.data.error);
        if ('password' in error) {
          error;
        } else {
          setError(error.response.data.error);
        }
      });
  };
  const handleGetUser = (event) => {
    event.preventDefault();
    console.log('csrf is:', csrf);

    getUser()
      .then((data) => {
        console.log('Response data:', data);
        setUser((u) => {
          return {...u, ...data};
        });
      })
      .catch((error) => {
        console.log('Error:', error);
      });
  };

  if (!isAuthenticated) {
    return (
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-sm-6 login-section-wrapper'>
            <div className='brand-wrapper'>
              {error && (
                <div className='alert alert-danger'>
                  {error.includes('password') ? (
                    <div>
                      Password is incorrect,{' '}
                      <Link to='/signup' className='text-reset'>
                        Forgot your password?
                      </Link>
                    </div>
                  ) : (
                    error
                  )}
                </div>
              )}
            </div>

            <div className='login-wrapper my-auto'>
              <h1 className='login-title'>Log In</h1>
              <form onSubmit={handleSubmit}>
                <div className='form-group mb-3'>
                  <label htmlFor='email'>Email</label>
                  <input
                    type='text'
                    value={email}
                    className='form-control'
                    placeholder='enter your email'
                    id='email'
                    required
                    autoFocus
                    onChange={handleChange('email')}
                  />
                </div>
                <div className='form-group mb-3'>
                  <label htmlFor='password'>Password</label>
                  <input
                    type='password'
                    value={password}
                    className='form-control'
                    placeholder='enter your password'
                    id='password'
                    required
                    autoFocus
                    onChange={handleChange('password')}
                  />
                </div>
                <button className='btn btn-block login-btn' type='submit'>
                  Log In
                </button>
              </form>
              <Link to='/forgot-password' className='forgot-password-link'>
                Forgot password?
              </Link>
              <p className='login-wrapper-footer-text'>
                Don't have an account?{' '}
                <Link to='/register' className='text-reset'>
                  Register
                </Link>
              </p>
            </div>
          </div>
          <div className='col-sm-6 px-0 d-none d-sm-block'>
            <img
              src='https://images.unsplash.com/photo-1617957718645-7680362d6312?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA=='
              alt='login image'
              className='login-img'
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='container-mt-3 p-4'>
      <h1>Authenticated</h1>
      <p> Logged in</p>
      <button className='btn login-btn' onClick={handleGetUser}>
        Get The User
      </button>{' '}
      <button
        className='btn login-btn'
        onClick={() => {
          logout();
          setIsAuthenticated(false);
          getCsrfToken();
        }}
      >
        Log out
      </button>{' '}
      <button
        className='btn login-btn'
        onClick={() => {
          navigate('/user-activation');
        }}
      >
        Go to admin
      </button>{' '}
      <button
        className='btn login-btn'
        onClick={() => {
          navigate('/SupplierDashboard/Products');
        }}
      >
        Go to supplier
      </button>
    </div>
  );
};

export default Login;
