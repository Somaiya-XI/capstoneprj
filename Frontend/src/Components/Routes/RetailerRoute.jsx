import {useContext} from 'react';
import {Navigate} from 'react-router-dom';
import {useUserContext, useCsrfContext} from '../../Contexts/index.jsx';

const RetailerRoute = ({children}) => {
  const {isAuthenticated} = useCsrfContext();
  const {user} = useUserContext();

  if (isAuthenticated && user.role === 'RETAILER') {
    return <>{children}</>;
  }
  return <Navigate to='/' replace={true} />;
};

export default RetailerRoute;
