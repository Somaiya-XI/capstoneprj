import './form.css';
import loginImg from '../../assets/loginImage.webp';

import {useReducer} from 'react';
import {useCsrfContext} from '../../Contexts/index.jsx';

import {
  FormsContainer,
  AddressIcon,
  CompIcon,
  UiwRegister,
  IconedInput,
  EmailFeild,
  FormButton,
  ImageField,
  PasswordFeild,
  PhoneField,
  FormCheck,
  CustomSuccessToast,
} from '../../Components/index.jsx';

const Register = () => {
  const {register} = useCsrfContext();

  const initState = {
    company_name: '',
    email: '',
    password: '',
    role: '',
    phone: '',
    address: '',
    commercial_reg: null,
    error: [],
    success: false,
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case 'input':
        return {...state, error: [], [action.field]: action.value};
      case 'reset':
        return initState;
      case 'error':
        const errorMessages = Object.values(action.error).flat();

        return {
          ...state,
          error: errorMessages,
          success: false,
        };
      case 'success':
        return {...state, error: [], success: true};
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initState);

  const links = [
    {link: '/login', text: 'Log In'},
    {link: '/forgot-password', text: 'Forgot password?'},
  ];

  const handleChange = (name) => (e) => {
    if (name === 'phone') {
      dispatch({
        type: 'input',
        field: name,
        value: e,
      });
    } else {
      dispatch({
        type: 'input',
        field: name,
        value: e.target.value,
      });
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();
    register(state)
      .then((data) => {
        console.log('Data', data);
        let errors = [];
        if (data.hasOwnProperty('id')) {
          dispatch({type: 'success'});
          CustomSuccessToast({msg: 'account created, wait for activation'});
        } else if (data.hasOwnProperty('email')) {
          errors.push(data.email);
        } else if (data.hasOwnProperty('password')) {
          errors.push(data.password);
        } else if (data.hasOwnProperty('company_name')) {
          errors.push(data.company_name);
        } else if (data.hasOwnProperty('role')) {
          errors.push('Please select a role');
        } else if (data.hasOwnProperty('commercial_reg')) {
          errors.push('Commercial Register is required, please upload a valid image.');
        }
        if (errors.length > 0) {
          throw errors;
        }
      })
      .catch((errors) => {
        console.log(errors);
        dispatch({type: 'error', error: errors});
      });
  };
  return (
    <>
      <FormsContainer
        errors={state.error.length === 0 ? '' : state.error.map((error) => `${error}`).join('\n')}
        formIcon={UiwRegister}
        formTitle={' Register'}
        formLinks={links}
        handleSubmit={onSubmit}
        formImage={loginImg}
      >
        <IconedInput
          value={state.company_name}
          onChange={handleChange('company_name')}
          icon={CompIcon}
          placeholder='enter your company name'
          className='form-control'
          fontSize='38px'
          autoFocus
          required
        />
        <EmailFeild value={state.email} onChange={handleChange('email')} />
        <PasswordFeild value={state.password} onChange={handleChange('password')} />
        <ImageField text='upload commercial register' dispatch={dispatch} />
        <PhoneField value={state.phone} onChange={handleChange('phone')} />{' '}
        <IconedInput
          type='textarea'
          value={state.address}
          onChange={handleChange('address')}
          icon={AddressIcon}
          placeholder={`enter your address\ncountry:\ncity:`}
          className='form-control'
          fontSize='24px'
        />
        <FormCheck
          text="I'm Retailer"
          value='RETAILER'
          checked={state.role === 'RETAILER'}
          onChange={handleChange('role')}
        />
        <FormCheck
          text="I'm Supplier"
          value='SUPPLIER'
          checked={state.role === 'SUPPLIER'}
          onChange={handleChange('role')}
        />
        <FormButton text='Register' />
      </FormsContainer>
    </>
  );
};

export default Register;
