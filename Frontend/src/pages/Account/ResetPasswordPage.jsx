import './form.css';
import loginImg from '../../assets/loginImage.webp';
import {API} from '../../backend.jsx';

import {useReducer} from 'react';
import {useParams} from 'react-router-dom';

import {
  FormsContainer,
  UiResetPassword,
  PasswordIcon1,
  PasswordFeild,
  FormButton,
  CustomSuccessToast,
} from '../../Components/index.jsx';
import {toast} from 'sonner';

const ResetPassword = () => {
  const initState = {
    password: '',
    confirmPassword: '',
    error: [],
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case 'input':
        return {...state, error: '', [action.field]: action.value};
      case 'reset':
        return initState;
      case 'error':
        const errorMessages = Object.values(action.error).flat();

        return {
          ...state,
          error: errorMessages,
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initState);

  const links = [
    {link: '/register', text: 'Register'},
    {link: '/login', text: 'Log in'},
  ];
  const {uidb64, token} = useParams();

  const handleChange = (name) => (e) => {
    dispatch({
      type: 'input',
      field: name,
      value: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    let err = [];

    if (state.password !== state.confirmPassword) {
      err.push('Passwords do not match');
      dispatch({
        type: 'error',
        error: err,
      });
      return;
    }
    try {
      const response = await fetch(`${API}user/set-new-password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uidb64,
          token,
          new_password: state.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        if (data.hasOwnProperty('error')) {
          err = [];
          err.push(data.error);
          dispatch({
            type: 'error',
            error: err,
          });
        }
        if (data.hasOwnProperty('message')) {
          CustomSuccessToast({msg: data.message});
        }
      } else {
        toast.error("You've already reset your password!", {
          duration: 2500,
          position: 'bottom-left',
          style: {background: 'rgb(254 242 242)'},
          className: 'text-dark',
          icon: (
            <Iconify-icon
              className='inline'
              icon='line-md:alert-circle-twotone'
              width='24'
              height='24'
              begin='0s'
              dur='0.6'
              style={{color: ' rgb(127, 29, 29)'}}
            />
          ),
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <FormsContainer
        errors={state.error.length === 0 ? '' : state.error.map((error) => `${error}`).join('\n')}
        formIcon={UiResetPassword}
        formTitle={' Reset Password'}
        formLinks={links}
        handleSubmit={handleSubmit}
        formImage={loginImg}
        formIconProps={{fontSize: '34px'}}
      >
        <PasswordFeild
          value={state.password}
          onChange={handleChange('password')}
          icon={PasswordIcon1}
          fontSize='24px'
        />
        <PasswordFeild
          value={state.confirmPassword}
          onChange={handleChange('confirmPassword')}
          icon={PasswordIcon1}
          placeholder='confirm your password'
          fontSize='24px'
        />
        <FormButton text='Reset' />
      </FormsContainer>
    </>
  );
};

export default ResetPassword;
