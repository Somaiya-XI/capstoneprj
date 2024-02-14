import axios from 'axios';
import { json } from 'react-router-dom';

export const getCSRF = () => {
  return axios
    .get('http://localhost:8000/user/csrf/', { withCredentials: true })
    .then((response) => {
      let csrfToken = response.headers['x-csrftoken'];
      console.log('getcsrf: ', csrfToken);
      return csrfToken;
    })
    .catch((err) => console.log(err));
};

export const getSession = async (setAuth, setCSRF) => {
  try {
    const response = await axios.get('http://localhost:8000/user/session/', {
      withCredentials: true,
    });
    const data = response.data;
    console.log(data);
    if (data.isAuthenticated) {
      setAuth(true);
    } else {
      setAuth(false);
      setCSRF(await getCSRF());
    }
  } catch (error) {
    console.log(error);
  }
};

export const register = (user) => {
  const formData = new FormData();
  for (const name in user) {
    formData.append(name, user[name]);
  }
  return fetch('http://localhost:8000/user/', {
    method: 'POST',
    body: formData,
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.log(err));
};

export const login = (user, csrf) => {
  console.log('insideLogin: ', csrf);

  return axios
    .post('http://localhost:8000/user/login/', user, {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrf,
      },
      withCredentials: true,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

// export const getCSRF = () => {
//   return fetch('http://localhost:8000/user/csrf/', {
//     credentials: 'include',
//   })
//     .then((response) => {
//       let csrfToken = response.headers.get('X-CSRFToken');
//       console.log('getcsrf: ', csrfToken);
//       return csrfToken;
//     })
//     .catch((err) => console.log(err));
// };

// export const getSession = (setAuth, setCSRF) => {
//   return fetch('http://localhost:8000/user/session/', {
//     credentials: 'include',
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       console.log(data);
//       if (data.isAuthenticated) {
//         setAuth(true);
//       } else {
//         setAuth(false);
//         setCSRF(getCSRF());
//       }
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// };

// export const register = (user) => {
//   return fetch('http://localhost:8000/user/', {
//     method: 'POST',
//     body: JSON.stringify(user),
//   })
//     .then((response) => {
//       return response.json();
//     })
//     .catch((err) => console.log(err));
// };

// export const login = (user, csrf) => {
//   console.log('insideLogin: ', csrf);

//   return fetch('http://localhost:8000/user/login/', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'X-CSRFToken': csrf,
//     },
//     credentials: 'include',
//     body: JSON.stringify(user),
//   })
//     .then((response) => {
//       return response.json();
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// };
