import {useContext} from 'react';
import {Navigate} from 'react-router-dom';
import {useUserContext} from '../../Contexts/index.jsx';

const SupplierRoute = ({children}) => {
  const {role, isAuthenticated} = useUserContext();

  if (isAuthenticated && role === 'SUPPLIER') {
    return <>{children}</>;
  }
  return <Navigate to='/' replace={true} />;
};

export default SupplierRoute;
