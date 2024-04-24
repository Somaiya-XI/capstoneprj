import UserContext from './UserContext';
import {Outlet} from 'react-router-dom';
import {useState, useContext, useEffect} from 'react';
import {API} from '../../backend';

const UserContextProvider = ({children}) => {
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [csrf, setCSRF] = useState('');
  const [role, setRole] = useState('');
  const [user, setUser] = useState(() => {
    const localUser = localStorage.getItem('user');
    try {
      return localUser ? JSON.parse(localUser) : {};
    } catch (error) {
      console.error('Invalid JSON data:', error);
      return {};
    }
  });

  useEffect(() => {
    //console.log('user: ', user);
    // localStorage.setItem('csrf', JSON.stringify(csrf));
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  // async function getCsrfToken() {
  //   let _csrfToken = null;

  //   const response = await fetch(`${API}user/get-csrf/`, {
  //     credentials: 'include',
  //   });
  //   const data = await response.json();
  //   _csrfToken = data.csrfToken;

  //   console.log('csrf:', _csrfToken);
  //   setCSRF(_csrfToken);
  //   return _csrfToken;
  //}
  const userValues = {
    // csrf,
    // setCSRF,
    // isAuthenticated,
    // setIsAuthenticated,
    role,
    setRole,
    user,
    setUser,
    
  };

  return <UserContext.Provider value={userValues}>{children}</UserContext.Provider>;
};
export default UserContextProvider;

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('context must be used in context provider');
  }
  return context;
}