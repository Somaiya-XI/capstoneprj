import axios from 'axios';
import CsrfTokenContext from './CsrfTokenContext';
import {useState, useContext, useEffect} from 'react';
import {API} from '../../backend';

const CsrfTokenContextProvider = ({children}) => {
  const [csrf, setCSRF] = useState(() => {
    const currentCsrf = localStorage.getItem('csrf');
    try {
      return currentCsrf ? currentCsrf : {};
    } catch (error) {
      console.error('Invalid JSON data:', error);
      return {};
    }
  });
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
  useEffect(() => {
    localStorage.setItem('csrf', csrf);
  }, [csrf]);
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

  // Initialize Axios instance with default configuration
  const ax = axios.create({
    withCredentials: true, // Always include credentials
  });

  // Add a request interceptor to set CSRF token in headers
  ax.interceptors.request.use((config) => {
    // Set CSRF token in the request headers
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
      await getCsrfToken();
      console.log('Context Logout Success');
    } catch (err) {
      console.log(err);
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
