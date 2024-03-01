import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import UserContext from '../../hooks/UserContext';

const RetailerRoute = ({ children }) => {
  const { role, isAuthenticated } = useContext(UserContext);

  if (isAuthenticated && role === 'RETAILER') {
    return <>{children}</>;
  }
  return <Navigate to='/' replace={true} />;
};

export default RetailerRoute;
