import axios from 'axios';
import React, {useEffect} from 'react';
import './google.css';
import {API, GOOGLE_CLIENT} from '../../backend';
import {useCsrfContext, useUserContext} from '../../Contexts';
import {CustomErrorToast} from '../BasicComponents/CustomAlerts';

const GoogleButton = () => {
  const {setUser} = useUserContext();
  const {setCSRF, setIsAuthenticated, logUserIn} = useCsrfContext();
  const handleSigninWithGoogle = async (response) => {
    const payload = response.credential;
    console.log(payload);
    try {
      const server_res = await axios.post(`${API}user/google/`, {access_token: payload});
      console.log(server_res);
      if (server_res.data.hasOwnProperty('error')) {
        CustomErrorToast({msg: 'your account has not been activated'});
        return;
      }
      logUserIn(server_res.data)
        .then((response) => {
          let csrfToken = response.headers['x-csrftoken'];
          setCSRF(csrfToken);
          const current_user = response.data.user;
          console.log('user: ', current_user);
          setUser((oldUser) => {
            return {...oldUser, ...current_user};
          });
          setIsAuthenticated(true);
        })
        .catch((error) => {
          console.log('error occured', error.response.data.error);
        });
    } catch (error) {}
  };

  useEffect(() => {
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT,
      callback: handleSigninWithGoogle,
    });
    google.accounts.id.renderButton(document.getElementById('signInDiv'), {
      theme: 'filled_black',
      size: 'small',
      text: 'continue_with',
      shape: 'circle',
      width: '100',
      type: 'standard',
      locale: 'en',
    });
  }, []);
  return (
    <>
      <button id='signInDiv' className='flex my-0 py-0'></button>
    </>
  );
};

export default GoogleButton;
