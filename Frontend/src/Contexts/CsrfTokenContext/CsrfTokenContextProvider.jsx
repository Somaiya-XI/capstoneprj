import axios from 'axios';
import CsrfTokenContext from './CsrfTokenContext';
import {useState, useContext, useEffect} from 'react';
import {API} from '../../backend';

const CsrfTokenContextProvider = ({children}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [csrf, setCSRF] = useState('');

  async function getCsrfToken() {
    let _csrfToken = null;

    const response = await fetch(`${API}user/get-csrf/`, {
      credentials: 'include',
    });
    const data = await response.json();
    _csrfToken = data.csrfToken;

    console.log('csrf:', _csrfToken);
    setCSRF(_csrfToken);
    return _csrfToken;
  }

  async function getSession() {
    try {
      const response = await axios.get(`${API}user/session/`, {
        withCredentials: true,
      });
      const data = response.data;
      console.log(data);
      if (data.isAuthenticated) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        await getCsrfToken();
      }
    } catch (error) {
      console.log(error);
    }
  }
  const authValues = {
    csrf,
    setCSRF,
    isAuthenticated,
    setIsAuthenticated,
    getCsrfToken,
    getSession,
  };

  return <CsrfTokenContext.Provider value={authValues}>{children}</CsrfTokenContext.Provider>;
};
export default CsrfTokenContextProvider;

export function useCsrfContext() {
  const context = useContext(CsrfTokenContext);
  if (!context) {
    throw new Error('context must be used in context provider');
  }
  return context;
}
