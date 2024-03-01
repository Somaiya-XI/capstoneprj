import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import UserContext from '../../hooks/UserContext';

const SupplierRoute = ({ children }) => {
  const { role, isAuthenticated } = useContext(UserContext);

  if (isAuthenticated && role === 'SUPPLIER') {
    return <>{children}</>;
  }
  return <Navigate to='/' replace={true} />;
};

export default SupplierRoute;
