import {useContext} from 'react';
import {Navigate} from 'react-router-dom';
import {useUserContext, useCsrfContext} from '../../Contexts/index.jsx';

const AdminRoute = ({children}) => {
  const {isAuthenticated} = useCsrfContext();
  const {user} = useUserContext();

  if (isAuthenticated && user.role === 'ADMIN') {
    return <>{children}</>;
  }
  return <Navigate to='/' replace={true} />;
};

export default AdminRoute;
