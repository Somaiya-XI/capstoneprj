import axios from 'axios';
import CsrfTokenContext from './CsrfTokenContext';
import {useState, useContext, useEffect} from 'react';
import {API} from '../../backend';
import {useUserContext} from '@/Contexts';
import {toast} from 'sonner';
const CsrfTokenContextProvider = ({children}) => {
  const {setUser, user} = useUserContext();
  const [csrf, setCSRF] = useState();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const localAuth = localStorage.getItem('auth');
    try {
      return localAuth ? JSON.parse(localAuth) : false;
    } catch (error) {
      console.error('Invalid JSON data:', error);
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem('auth', JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  // useEffect(() => {
  //   localStorage.setItem('csrf', csrf);
  // }, [csrf]);

  useEffect(() => {
    getCsrfToken();
    getSession();
  }, [user]);

  async function getCsrfToken() {
    let _csrfToken = null;

    const response = await fetch(`${API}user/get-csrf/`, {
      credentials: 'include',
    });
    _csrfToken = response.headers.get('X-Csrftoken');
    setCSRF(_csrfToken);
    return _csrfToken;
  }

  // Axios instance with default configuration
  const ax = axios.create({
    withCredentials: true,
  });

  // Add CSRF token to request headers
  ax.interceptors.request.use((config) => {
    config.headers['X-CSRFToken'] = csrf;
    return config;
  });

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

  async function logUserOut() {
    console.log('Context Logout!');
    try {
      const response = await axios.get(`${API}user/logout`, {
        withCredentials: true,
      });
      const data = response.data;
      console.log(data);
      setIsAuthenticated(false);
      const initialUser = {
        id: null,
        email: '',
        company_name: '',
        role: '',
      };
      setUser((oldUser) => ({...oldUser, ...initialUser}));
      await getCsrfToken();
      console.log('Context Logout Success');
    } catch (err) {
      toast.error(err.response.data.message);
      console.log(err.response.data);
    }
  }

  const logUserIn = (user) => {
    return axios.post(`${API}user/login/`, user, {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrf,
      },
      withCredentials: true,
    });
  };

  const register = (user) => {
    const formData = new FormData();
    for (const name in user) {
      formData.append(name, user[name]);
    }
    return fetch(`${API}user/`, {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        return response.json();
      })
      .catch((err) => console.log(err));
  };

  const authValues = {
    ax,
    csrf,
    setCSRF,
    isAuthenticated,
    setIsAuthenticated,
    getCsrfToken,
    getSession,
    logUserOut,
    logUserIn,
    register,
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
