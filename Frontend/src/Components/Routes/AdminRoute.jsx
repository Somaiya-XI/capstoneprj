import {useContext} from 'react';
import {Navigate} from 'react-router-dom';
import {useUserContext} from '../../Contexts/index.jsx';

const AdminRoute = ({children}) => {
  const {role, isAuthenticated} = useUserContext();

  if (isAuthenticated && role === 'ADMIN') {
    return <>{children}</>;
  }
  return <Navigate to='/' replace={true} />;
};

export default AdminRoute;
