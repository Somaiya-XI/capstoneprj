import UserContext from './UserContext';
import {useState, useContext, useEffect} from 'react';

const UserContextProvider = ({children}) => {
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
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  const userValues = {
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
