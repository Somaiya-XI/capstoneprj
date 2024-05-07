import {API, imgURL} from '../../backend';
import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import './ActivationPage.css';
import {Avatar} from '@boringer-avatars/react';
import {useNavigate} from 'react-router-dom';
import {Switch, cn} from '@nextui-org/react';
import {BasicNav} from '../../Components';
import {useCsrfContext} from '@/Contexts';

const UserActivation = () => {
  const {ax} = useCsrfContext();
  const [isActive, setIsActive] = useState(false);
  const [values, setValues] = useState({
    users: [],
    filteredUsers: [],
    imageURL: '',
    errorMessage: '',
    showImagePopup: false,
  });

  const {users, filteredUsers, imageURL, errorMessage, showImagePopup} = values;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await ax.get(`${API}user/users/`);
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
  const onChange = (userEmail) => {
    if (isActive) {
      changeUserActivationStatus(userEmail, false);
      setIsActive(false);
    } else {
      changeUserActivationStatus(userEmail, true);
      setIsActive(true);
    }
  };

  const changeUserActivationStatus = (userEmail, shouldBeActive) => {
    const activationStatus = shouldBeActive ? 'True' : 'False';
    ax.post(`${API}user/activation/`, {
      user_email: userEmail,
      activation_status: activationStatus,
    })
      .then(() => {
        const updatedUsers = users.map((user) =>
          user.email === userEmail ? {...user, is_active: shouldBeActive} : user
        );
        setValues({
          ...values,
          users: updatedUsers,
          filteredUsers: updatedUsers.filter((user) => {
            if (document.getElementById('filterSelect').value === 'active') {
              return user.is_active === true;
            } else if (document.getElementById('filterSelect').value === 'inactive') {
              return user.is_active === false;
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
        updatedFilteredUsers = currentUsers.filter((user) => user.is_active === true);
        break;
      case 'inactive':
        updatedFilteredUsers = currentUsers.filter((user) => user.is_active === false);
        break;
      default:
        updatedFilteredUsers = currentUsers;
    }

    setValues({
      ...values,
      filteredUsers: updatedFilteredUsers,
    });
  };

  const handleImageClick = (commercial_reg) => {
    setValues({
      ...values,
      imageURL: `${imgURL}${commercial_reg}`,
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
      <BasicNav></BasicNav>
      <div className='container page-container'>
        {errorMessage && (
          <div className='alert alert-danger w-[650px]' role='alert'>
            {errorMessage}
          </div>
        )}
        <h2 className='text-center mt-4'>Accounts Management</h2>
        <div className='row'>
          <div className='col-sm-12'>
            <div className='form-group mb-10'>
              <label htmlFor='filterSelect'>Filter By:</label>
              <select className='form-control' id='filterSelect' onChange={(e) => handleFilterChange(e.target.value)}>
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
                  <tr key={user.id}>
                    <td>
                      {user.profile_picture ? (
                        <img
                          src={`${imgURL}${user.profile_picture}`}
                          alt='Profile Picture'
                          className='rounded-circle'
                          style={{width: '30px', height: '30px'}}
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
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <span
                        className={
                          user.is_active ? 'badge badge-active  rounded-pill' : 'badge badge-inactive  rounded-pill'
                        }
                      >
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <button
                        className='btn btn-link dark-green-link'
                        onClick={() => handleImageClick(user.commercial_reg)}
                      >
                        View Image
                      </button>
                    </td>
                    <td>
                      <Switch
                        className='relative'
                        classNames={{
                          wrapper:
                            'p-0 h-4 overflow-visible group-data-[selected=true]:bg-[#2b572e] bg-[#666666] mx-9 my-2',
                          thumb: cn(
                            'w-6 h-6 border-3 shadow-lg',
                            'border-[#666666]',
                            'group-data-[hover=true]:border-[#2b572e]',
                            //selected
                            'group-data-[selected=true]:ml-6',
                            'group-data-[selected=true]:border-[#2b572e]',
                            // pressed
                            'group-data-[selected]:group-data-[pressed]:ml-4'
                          ),
                        }}
                        isSelected={user.is_active}
                        onValueChange={() => onChange(user.email)}
                      ></Switch>
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
            <img src={imageURL} alt='Commercial Registration' className='img-fluid mt-4 w-[400px]' />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserActivation;
