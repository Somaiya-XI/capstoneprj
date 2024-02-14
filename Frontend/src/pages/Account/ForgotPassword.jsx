import React, { useState } from 'react';
import { API } from '../../backend';
import './form.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const requestPasswordReset = async (email) => {
    try {
      const response = await fetch(`${API}user/reset-password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.hasOwnProperty('error')) {
          setSuccessMessage('');
          setErrorMessage(data.error);
        }
        if (data.hasOwnProperty('message')) {
          setSuccessMessage(data.message);
          setErrorMessage('');
          setConfirmPassword('');
          setPassword('');
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await requestPasswordReset(email);
  };

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-sm-6 login-section-wrapper'>
          <div className='brand-wrapper'></div>
          {successMessage && (
            <div className='alert alert-success'>{successMessage}</div>
          )}
          {errorMessage && (
            <div className='alert alert-danger'>{errorMessage}</div>
          )}
          <div className='login-wrapper my-auto'>
            <h1 className='login-title'>Reset Password</h1>
            <form onSubmit={handleSubmit}>
              <div className='form-group mb-3'>
                <label htmlFor='email'>Email</label>
                <input
                  type='email'
                  value={email}
                  className='form-control'
                  placeholder='Enter your email'
                  id='email'
                  required
                  autoFocus
                  onChange={handleChange}
                />
              </div>
              <button type='submit' className='btn btn-block login-btn'>
                Reset Password
              </button>
            </form>
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

export default ForgotPassword;
