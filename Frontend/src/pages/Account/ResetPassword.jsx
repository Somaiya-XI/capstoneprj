import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './form.css';

const NewPasswordForm = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { uidb64, token } = useParams();

  const handleChange = (e) => {
    setPassword(e.target.value);
    setConfirmPassword(e.target.value);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    try {
      const response = await fetch(
        'http://localhost:8000/user/set-new-password/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uidb64,
            token,
            new_password: password,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data);
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

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-sm-6 login-section-wrapper'>
          <div className='brand-wrapper'></div>
          {errorMessage && (
            <div className='alert alert-danger'>{errorMessage}</div>
          )}
          {successMessage && (
            <div className='alert alert-success'>{successMessage}</div>
          )}
          <div className='login-wrapper my-auto'>
            <h1 className='login-title'>Reset Password</h1>
            <form onSubmit={handleSubmit}>
              <div className='form-group mb-3'>
                <label htmlFor='password'>New Password</label>
                <input
                  type='password'
                  value={password}
                  className='form-control'
                  placeholder='Enter your new password'
                  id='password'
                  required
                  autoFocus
                  onChange={(e) => {
                    setPassword(e.target.value);
                    handleChange();
                  }}
                />
              </div>
              <div className='form-group mb-3'>
                <label htmlFor='confirmPassword'>Confirm Password</label>
                <input
                  type='password'
                  value={confirmPassword}
                  className='form-control'
                  placeholder='Confirm your new password'
                  id='confirmPassword'
                  required
                  onChange={(e) => setConfirmPassword(e.target.value)}
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

export default NewPasswordForm;
