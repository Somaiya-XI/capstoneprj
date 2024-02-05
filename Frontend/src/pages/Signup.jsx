import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/form.css';
import { signup } from '../auth';

const Signup = () => {
  const [values, setValues] = useState({
    company_name: '',
    email: '',
    password: '',
    role: '',
    commercial_reg: '',
    phone: '',
    address: '',
    error: [],
    success: false,
  });

  const {
    company_name,
    email,
    password,
    role,
    commercial_reg,
    phone,
    address,
    error,
    success,
  } = values;

  const handleChange = (name) => (event) => {
    setValues({
      ...values,
      error: [],
      [name]: event.target.value,
    });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: [] });
    signup({
      company_name,
      email,
      password,
      role,
      commercial_reg,
      phone,
      address,
    })
      .then((data) => {
        console.log('Data', data);
        if (data.hasOwnProperty('company_name')) {
          setValues({ ...values, error: data.company_name, success: false });
        } else if (data.hasOwnProperty('email')) {
          setValues({ ...values, error: data.email, success: false });
        } else if (data.hasOwnProperty('password')) {
          setValues({ ...values, error: data.password, success: false });
        } else if (data.hasOwnProperty('role')) {
          const roleError = ['Please select a role'];
          setValues({ ...values, error: roleError, success: false });
        } else if (data.hasOwnProperty('password')) {
          setValues({ ...values, error: data.commercial_reg, success: false });
        } else {
          setValues({
            ...values,
            company_name: '',
            email: '',
            password: '',
            role: '',
            commercial_reg: '',
            phone: '',
            address: '',
            error: [],
            success: true,
          });
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
              Your account has been created
            </div>
          </div>
        </div>
      </div>
    );
  };

  const errorMsg = () => {
    const errorMessages = Object.values(error).flat();

    if (errorMessages.length === 0) {
      return null;
    }

    const passwordErrors = [];
    const otherErrors = [];

    errorMessages.forEach((errorMsg) => {
      if (errorMsg.toLowerCase().includes('password')) {
        passwordErrors.push(errorMsg);
      } else {
        otherErrors.push(errorMsg);
      }
    });

    if (passwordErrors.length > 0) {
      return (
        <div className='container-fluid'>
          <div className=''>
            <div className='alert alert-danger'>
              {passwordErrors.map((errorMsg, index) => (
                <p key={index}>{errorMsg}</p>
              ))}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className='container-fluid'>
          <div className=''>
            <div className=''>
              {error.length > 0 && (
                <div>
                  {error.map((errorMsg, index) => (
                    <p className='alert alert-danger' key={index}>
                      {errorMsg}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }
  };
  const signUpForm = () => {
    return (
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-sm-6 login-section-wrapper'>
            <div className='brand-wrapper'></div>
            {successMsg()}
            {errorMsg()}
            <div className='login-wrapper my-auto'>
              <h1 className='login-title'>Sign Up</h1>
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
                <div className='form-group mb-3'>
                  <label htmlFor='comp-n'>Company Name</label>
                  <input
                    type='text'
                    value={company_name}
                    className='form-control'
                    placeholder='enter the company name'
                    id='comp-n'
                    required
                    autofocus
                    onChange={handleChange('company_name')}
                  />
                </div>
                <div className='form-group mb-3'>
                  <label htmlFor='commercial_register'>
                    Commercial Register
                  </label>
                  <input
                    type='file'
                    className='form-control'
                    id='commercial_register'
                    accept='image/*'
                    onChange={handleChange('commercial_register')}
                  />
                </div>
                <div className='form-group mb-3'>
                  <label htmlFor='phone'>Phone</label>
                  <input
                    type='text'
                    className='form-control'
                    id='phone'
                    value={values.phone}
                    onChange={handleChange('phone')}
                  />
                </div>

                <div className='form-group'>
                  <label htmlFor='address'>Address</label>
                  <textarea
                    className='form-control'
                    id='address'
                    rows='3'
                    value={values.address}
                    onChange={handleChange('address')}
                  ></textarea>
                </div>

                <div className='form-check'>
                  <input
                    className='form-check-input'
                    type='radio'
                    name='flexRadioDefault'
                    id='flexRadioDefault1'
                    value='SUPPLIER'
                    checked={role === 'SUPPLIER'}
                    onChange={handleChange('role')}
                  />
                  <label
                    className='form-check-label'
                    htmlFor='flexRadioDefault1'
                  >
                    I'm Supplier
                  </label>
                </div>
                <div className='form-check'>
                  <input
                    className='form-check-input'
                    type='radio'
                    name='flexRadioDefault'
                    id='flexRadioDefault2'
                    value='RETAILER'
                    checked={role === 'RETAILER'}
                    onChange={handleChange('role')}
                  />
                  <label
                    className='form-check-label'
                    htmlFor='flexRadioDefault2'
                  >
                    I'm Retailer
                  </label>
                </div>
                <input
                  name='login'
                  id='login'
                  className='btn btn-block login-btn'
                  type='button'
                  value='Sign Up'
                  onClick={onSubmit}
                />
              </form>
              {/* <Link to='' className='forgot-password-link'>
                Forgot password?
              </Link> */}
              <p className='login-wrapper-footer-text'>
                Already have an account?{' '}
                <Link to='/signin' className='text-reset'>
                  Log in
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
      <title>Sign up page</title>

      {signUpForm()}
    </div>
  );
};

export default Signup;
