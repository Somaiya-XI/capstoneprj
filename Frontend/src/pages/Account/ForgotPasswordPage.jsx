import './form.css';
import loginImg from '../../assets/loginImage.webp';
import {API} from '../../backend.jsx';

import {useReducer} from 'react';

import {FormsContainer, UiForgotPassword, EmailFeild, FormButton, CustomSuccessToast} from '../../Components/index.jsx';

const ForgotPassword = () => {
  const initState = {
    email: '',
    error: '',
    success: false,
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case 'input':
        return {...state, error: '', [action.field]: action.value};
      case 'reset':
        return initState;
      case 'error':
        return {...state, error: action.error, success: false};
      case 'success':
        return {...state, error: '', success: true};
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initState);

  const links = [
    {link: '/register', text: 'Register'},
    {link: '/login', text: 'Log in'},
  ];

  const requestPasswordReset = async (email) => {
    try {
      const response = await fetch(`${API}user/reset-password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email}),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.hasOwnProperty('error')) {
          dispatch({type: 'error', error: data.error});
        }
        if (data.hasOwnProperty('message')) {
          dispatch({type: 'success'});
          CustomSuccessToast({msg: data.message});
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (name) => (e) => {
    dispatch({
      type: 'input',
      field: name,
      value: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await requestPasswordReset(state.email);
  };

  return (
    <>
      <FormsContainer
        errors={state.error ? state.error : ''}
        formIcon={UiForgotPassword}
        formTitle={'Forgot Password'}
        formLinks={links}
        handleSubmit={handleSubmit}
        formImage={loginImg}
        formIconProps={{fontSize: '37px'}}
      >
        <EmailFeild placeholder='please enter your email' value={state.email} onChange={handleChange('email')} />
        <FormButton text='Send Link' />
      </FormsContainer>
    </>
  );
};

export default ForgotPassword;
