import {useContext} from 'react';
import {Navigate} from 'react-router-dom';
import {useUserContext, useCsrfContext} from '../../Contexts/index.jsx';

const SupplierRoute = ({children}) => {
  const {isAuthenticated} = useCsrfContext();
  const {user} = useUserContext();

  if (isAuthenticated && user.role === 'SUPPLIER') {
    return <>{children}</>;
  }
  return <Navigate to='/' replace={true} />;
};

export default SupplierRoute;
