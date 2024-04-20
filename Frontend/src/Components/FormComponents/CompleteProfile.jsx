import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/Components/ui/sheet';
import {Button, Input} from '@nextui-org/react';
import {Link} from 'react-router-dom';
import {useCsrfContext, useUserContext} from '../../Contexts/index.jsx';
import {
  CompIcon,
  IconedInput,
  ImageField,
  FormCheck,
  CustomSuccessToast,
  CustomErrorToast,
} from '@/Components/index.jsx';
import {useReducer} from 'react';
import '@/pages/Account/form.css';
import axios from 'axios';
import {API} from '@/backend.jsx';
import {NavLink} from 'react-router-dom';

export function ProfileSheet() {
  const {user} = useUserContext();
  const {logUserOut, setIsAuthenticated, getCsrfToken} = useCsrfContext();

  const id = user.id;
  const initState = {
    company_name: '',
    role: '',
    commercial_reg: '  ',
    error: [],
    success: false,
  };
  const deactivate = {is_active: false};

  const manageLogOut = async () => {
    try {
      logUserOut();
      setIsAuthenticated(false);
      await getCsrfToken();
    } catch (err) {
      console.log(err);
    }
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case 'input':
        return {...state, error: [], [action.field]: action.value};
      case 'reset':
        return initState;
      case 'error':
        CustomErrorToast({msg: action.error, shiftStart: 'ms-0'});

        return {
          ...state,
          error: action.error,
          success: false,
        };
      case 'success':
        CustomSuccessToast({msg: 'account updated, wait a bit for activation', shiftStart: 'ms-0'});
        manageLogOut();
        axios.put(`${API}user/update/${id}/`, deactivate);

        return {...state, error: [], success: true};
      default:
        return state;
    }
  };
  const [state, dispatch] = useReducer(reducer, initState);

  const handleChange = (name) => (e) => {
    {
      dispatch({
        type: 'input',
        field: name,
        value: e.target.value,
      });
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();
    axios
      .put(`${API}user/update/${id}/`, state)
      .then((response) => {
        console.log('Data', response);
        if (response.data.hasOwnProperty('id')) {
          dispatch({type: 'success'});
        } else if (response.data.hasOwnProperty('company_name')) {
          dispatch({type: 'error', error: 'Please provide your company name'});
        } else if (response.data.hasOwnProperty('role')) {
          dispatch({type: 'error', error: 'Please select a role'});
        } else if (response.data.hasOwnProperty('commercial_reg')) {
          dispatch({type: 'error', error: 'Please upload a valid image.'});
        }
      })
      .catch((errors) => {
        console.log(errors);
      });
  };
  return (
    <Sheet defaultOpen>
      <SheetTrigger asChild>
        <NavLink className='btn_row d-flex justify-between px-3 gap-md-1'>
          <Iconify-icon
            inline
            icon='fa-solid:user-edit'
            width='24'
            height='24'
            style={{color: '#8fdb6f'}}
          ></Iconify-icon>
          <button variant='outline' className='text-sm'>
            complete profile
          </button>
        </NavLink>
      </SheetTrigger>
      <SheetContent className='z-[100]'>
        <SheetHeader>
          <SheetTitle>Complete Your Profile to access all app features!</SheetTitle>
        </SheetHeader>
        <div className='grid gap-4 py-4'>
          <IconedInput
            value={state.company_name}
            onChange={handleChange('company_name')}
            icon={CompIcon}
            placeholder='enter your company name'
            className=' profile-sheet form-control'
            fontSize='38px'
            autoFocus
            required
          />
          <ImageField
            text='upload commercial register'
            dispatch={dispatch}
            className='flex items-center px-3 py-3 text-center bg-white border-2 border-dashed rounded-lg cursor-pointer mx-4 my-0'
          />
          <div className='mx-[30px]'>
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
          </div>
        </div>
        <SheetClose asChild>
          <div className='flex items-center justify-center mt-6'>
            <Button onClick={onSubmit}>Save changes</Button>
          </div>
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
}
