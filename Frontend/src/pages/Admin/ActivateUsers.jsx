import { API } from '../../backend';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ActivationPage.css';
import { Avatar } from '@boringer-avatars/react';

const UserActivation = () => {
  const [values, setValues] = useState({
    users: [],
    filteredUsers: [],
    imageURL: '',
    errorMessage: '',
    showImagePopup: false,
  });

  const { users, filteredUsers, imageURL, errorMessage, showImagePopup } =
    values;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API}user/users/`);
      let data = response.data;
      setValues({
        ...values,
        filteredUsers: data,
        users: data,
      });
    } catch (error) {
      console.error(error);
      setValues({
        ...values,
        errorMessage: 'Failed to fetch users.',
      });
    }
  };
  const activateUser = (userEmail) => {
    changeUserActivationStatus(userEmail, true);
  };

  const deactivateUser = (userEmail) => {
    changeUserActivationStatus(userEmail, false);
  };

  const changeUserActivationStatus = (userEmail, shouldBeActive) => {
    const activationStatus = shouldBeActive ? 'True' : 'False';
    axios
      .post(`${API}user/activation/`, {
        user_email: userEmail,
        activation_status: activationStatus,
      })
      .then(() => {
        const updatedUsers = users.map((user) =>
          user.fields.email === userEmail
            ? { ...user, fields: { ...user.fields, is_active: shouldBeActive } }
            : user
        );
        setValues({
          ...values,
          users: updatedUsers,
          filteredUsers: updatedUsers.filter((user) => {
            if (document.getElementById('filterSelect').value === 'active') {
              return user.fields.is_active === true;
            } else if (
              document.getElementById('filterSelect').value === 'inactive'
            ) {
              return user.fields.is_active === false;
            }
            return true;
          }),
        });
      })
      .catch((error) => {
        console.error(error);
        const actionWord = shouldBeActive ? 'activate' : 'deactivate';
        setValues({
          ...values,
          errorMessage: 'Failed to fetch users.',
        });
      });
  };

  const handleFilterChange = (status) => {
    let updatedFilteredUsers;
    const currentUsers = [...users];

    switch (status) {
      case 'active':
        updatedFilteredUsers = currentUsers.filter(
          (user) => user.fields.is_active === true
        );
        break;
      case 'inactive':
        updatedFilteredUsers = currentUsers.filter(
          (user) => user.fields.is_active === false
        );
        break;
      default:
        updatedFilteredUsers = currentUsers;
    }

    setValues({
      ...values,
      filteredUsers: updatedFilteredUsers,
    });
  };

  const handleImageClick = (commercialRegPath) => {
    setValues({
      ...values,
      imageURL: `${API}user/images/${commercialRegPath}`,
      showImagePopup: true,
    });
  };

  const closeImagePopup = () => {
    setValues({
      ...values,
      showImagePopup: false,
      imageURL: '',
    });
  };

  return (
    <div>
      {errorMessage && (
        <div className='alert alert-danger' role='alert'>
          {errorMessage}
        </div>
      )}

      <div className='container page-container'>
        <h2 className='text-center mt-4'>Accounts Management</h2>
        <div className='row'>
          <div className='col-sm-12'>
            <div className='form-group'>
              <label htmlFor='filterSelect'>Filter By:</label>
              <select
                className='form-control'
                id='filterSelect'
                onChange={(e) => handleFilterChange(e.target.value)}
              >
                <option value='all'>All</option>
                <option value='active'>Active</option>
                <option value='inactive'>Inactive</option>
              </select>
            </div>
            <table className='table table-rounded'>
              <thead className='thead-green'>
                <tr>
                  <th>Profile Photo</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Commercial Reg</th>
                  <th>Account Activation</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.pk}>
                    <td>
                      {user.fields.profile_picture ? (
                        <img
                          src={`${API}user/images/${user.fields.profile_picture}`}
                          alt='Profile Picture'
                          className='rounded-circle'
                          style={{ width: '30px', height: '30px' }}
                        />
                      ) : (
                        <Avatar
                          title={false}
                          size={'30px'}
                          variant='beam'
                          name='Mother Frances'
                          square={false}
                          colors={['', '', '#bfbfbf', '', '#617f62']}
                        />
                      )}
                    </td>
                    <td>{user.fields.email}</td>
                    <td>{user.fields.role}</td>
                    <td>
                      <span
                        className={
                          user.fields.is_active
                            ? 'badge badge-active  rounded-pill'
                            : 'badge badge-inactive  rounded-pill'
                        }
                      >
                        {user.fields.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <button
                        className='btn btn-link dark-green-link'
                        onClick={() =>
                          handleImageClick(user.fields.commercial_reg)
                        }
                      >
                        View Image
                      </button>
                    </td>
                    <td>
                      {user.fields.is_active ? (
                        <button
                          className='btn deactivate-btn'
                          onClick={() => deactivateUser(user.fields.email)}
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          className='btn activate-btn'
                          onClick={() => activateUser(user.fields.email)}
                        >
                          Activate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showImagePopup && (
        <div className='popup'>
          <div className='popup-inner'>
            <button className='close-button' onClick={closeImagePopup}>
              &times;
            </button>
            <img
              src={imageURL}
              alt='Commercial Registration'
              className='img-fluid mt-4'
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserActivation;
