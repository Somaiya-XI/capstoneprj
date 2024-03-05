import UserContext from './UserContext';
import {Outlet} from 'react-router-dom';
import {useState} from 'react';

const UserContextProvider = ({children}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [csrf, setCSRF] = useState('');
  const [role, setRole] = useState('');
  const [user, setUser] = useState({});
  const userValues = {
    csrf,
    setCSRF,
    isAuthenticated,
    setIsAuthenticated,
    role,
    setRole,
    user,
    setUser,
  };

  return (
    <UserContext.Provider value={userValues}>
      <Outlet />
      {children}
    </UserContext.Provider>
  );
};
export default UserContextProvider;
