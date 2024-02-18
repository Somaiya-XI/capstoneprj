import UserContext from '../../hooks/UserContext';
import { Outlet } from 'react-router-dom';

import { useState } from 'react';

const UserContextProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [csrf, setCSRF] = useState('');
  const [role, setRole] = useState('');

  const userValues = {
    csrf,
    setCSRF,
    isAuthenticated,
    setIsAuthenticated,
    role,
    setRole,
  };

  return (
    <UserContext.Provider value={userValues}>
      <Outlet />
      {children}
    </UserContext.Provider>
  );
};
export default UserContextProvider;
