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
