import axios from 'axios';
import { API } from '../../backend';

export const register = (user) => {
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

export const isResponseOK = (response) => {
  if (response.status >= 200 && response.status <= 299) {
    return response;
  } else {
    throw Error(response.statusText);
  }
};

export const logout = () => {
  return axios
    .get(`${API}user/logout`, {
      withCredentials: true,
    })
    .then(isResponseOK)
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const login = (user, csrf) => {
  return axios.post(`${API}user/login/`, user, {
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrf,
    },
    withCredentials: true,
  });
};

export const getUser = () => {
  fetch(`${API}user/get-user/`, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Logged in as: ' + data.email);
    })
    .catch((error) => {
      console.log(error);
    });
};
