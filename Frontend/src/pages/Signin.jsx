import React, { useState, useContext } from 'react';
import useAuth from '../hooks/useAuth';
import { Link, Navigate, useLocation } from 'react-router-dom';
import '../assets/form.css';
import { signin, authenticate, isAuthenticated } from '../auth';
import Home from './Home';

const Signin = () => {
  const location = useLocation();
  const from = location.state?.from.pathname || '/';

  const RedirectUser = () => {
    if (isAuthenticated()) {
      return <redirect to='/signup' />;
    }
  };

  const [values, setValues] = useState({
    email: '',
    password: '',
    error: '',
    success: false,
    loading: false,
    didRedirect: false,
  });

  const { email, password, error, success, loading, didRedirect } = values;

  const handleChange = (name) => (event) => {
    setValues({
      ...values,
      error: false,
      [name]: event.target.value,
    });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: false, loading: true });
    signin({ email, password })
      .then((data) => {
        console.log('DATA', data);
        if (data.token) {
          let sessionToken = data.token;
          authenticate(sessionToken, () => {
            console.log('Token Added');
            // replace the signin in their navigation history to their location they came from

            setValues({
              ...values,
              email: '',
              password: '',
              error: '',
              success: true,
              didRedirect: true,
            });
          });
        } else {
          setValues({ ...values, error: data.error, success: false });
        }
      })

      .catch((e) => console.log(e));
  };

  const successMsg = () => {
    return (
      <div className='container-fluid'>
        <div className=''>
          <div className=''>
            <div
              className='alert alert-success'
              style={{ display: success ? '' : 'none' }}
            >
              You Logged in Successfully
            </div>
          </div>
        </div>
      </div>
    );
  };

  const errorMsg = () => {
    return (
      <div className='container-fluid'>
        <div className=''>
          <div className=''>
            {error && <div className='alert alert-danger'>{error}</div>}
          </div>
        </div>
      </div>
    );
  };
  const signInForm = () => {
    return (
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-sm-6 login-section-wrapper'>
            <div className='brand-wrapper'></div>
            {successMsg()}
            {errorMsg()}
            <div className='login-wrapper my-auto'>
              <h1 className='login-title'>Log In</h1>
              <form action='#!'>
                <div className='form-group mb-3'>
                  <label htmlFor='email'>Email</label>
                  <input
                    type='text'
                    value={email}
                    className='form-control'
                    placeholder='enter your email'
                    id='email'
                    required
                    autofocus
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
                    autofocus
                    onChange={handleChange('password')}
                  />
                </div>
                <input
                  name='login'
                  id='login'
                  className='btn btn-block login-btn'
                  type='button'
                  value='Login'
                  onClick={onSubmit}
                />
              </form>
              {/* <Link to='' className='forgot-password-link'>
                Forgot password?
              </Link> */}
              <p className='login-wrapper-footer-text'>
                Don't have an account?{' '}
                <Link to='/signup' className='text-reset'>
                  Sign up
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
  };

  return (
    <div>
      {signInForm()}

      <p></p>
    </div>
  );
};

export default Signin;
