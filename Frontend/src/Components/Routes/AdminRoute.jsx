import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import UserContext from '../../hooks/UserContext';

const AdminRoute = ({ children }) => {
  const { role, isAuthenticated } = useContext(UserContext);

  if (isAuthenticated && role === 'ADMIN') {
    return <>{children}</>;
  }
  return <Navigate to='/' replace={true} />;
};

export default AdminRoute;
