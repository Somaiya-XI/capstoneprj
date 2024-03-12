import {useContext} from 'react';
import {Navigate} from 'react-router-dom';
import {useUserContext} from '../../Contexts/index.jsx';

const RetailerRoute = ({children}) => {
  const {role, isAuthenticated} = useUserContext();

  if (isAuthenticated && role === 'RETAILER') {
    return <>{children}</>;
  }
  return <Navigate to='/' replace={true} />;
};

export default RetailerRoute;
