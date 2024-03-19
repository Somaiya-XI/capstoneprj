import './form.css';
import loginImg from '../../assets/loginImage.webp';

import {useEffect, useReducer} from 'react';
import {useUserContext, useCsrfContext} from '../../Contexts/index.jsx';
import {Navigate} from 'react-router-dom';

import {FormsContainer, UiwLogin, EmailFeild, PasswordFeild, FormButton} from '../../Components/index.jsx';

const Login = () => {
  const {setUser, user} = useUserContext();
  const {isAuthenticated, getSession, logUserIn, setIsAuthenticated, setCSRF} = useCsrfContext();

  const initState = {
    email: '',
    password: '',
    error: '',
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case 'input':
        return {...state, error: '', [action.field]: action.value};
      case 'reset':
        return initState;
      case 'error':
        return {...state, error: action.value};
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initState);

  const links = [
    {link: '/register', text: 'Register'},
    {link: '/forgot-password', text: 'Forgot password?'},
  ];

  useEffect(() => {
    getSession();
  }, []);

  const handleChange = (name) => (e) => {
    dispatch({
      type: 'input',
      field: name,
      value: e.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    logUserIn(state)
      .then((response) => {
        let csrfToken = response.headers['x-csrftoken'];
        setCSRF(csrfToken);
        const current_user = response.data.user;
        setUser((oldUser) => {
          return {...oldUser, ...current_user};
        });
        setIsAuthenticated(true);
        dispatch({
          type: 'reset',
        });
      })
      .catch((error) => {
        console.log('error occured', error.response.data.error);
        if ('password' in error) {
          dispatch({
            type: 'error',
            value: error,
          });
        } else {
          dispatch({
            type: 'error',
            value: error.response.data.error,
          });
        }
      });
  };
  if (!isAuthenticated) {
    return (
      <>
        <FormsContainer
          errors={state.error ? state.error : ''}
          formIcon={UiwLogin}
          formTitle={' Log In'}
          formLinks={links}
          handleSubmit={handleSubmit}
          formImage={loginImg}
        >
          <EmailFeild value={state.email} onChange={handleChange('email')} />
          <PasswordFeild value={state.password} onChange={handleChange('password')} />
          <FormButton text='Log In' />
        </FormsContainer>
      </>
    );
  }
  if (isAuthenticated && user.role === 'SUPPLIER') {
    return <Navigate to='/supplier-dashboard/products' replace={true} />;
  }
  if (isAuthenticated && user.role === 'RETAILER') {
    return <Navigate to='/' />;
  }
};

export default Login;
