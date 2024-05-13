import UserContext from './UserContext';
import {useState, useContext, useEffect} from 'react';
import {WS_API, API} from '@/backend';
import {toast} from 'sonner';
import axios from 'axios';

const UserContextProvider = ({children}) => {
  const [userNotifications, setUserNotifications] = useState([]);
  const [confirmationAlert, setConfirmationAlert] = useState(0);
  const [deviceId, setDeviceId] = useState();

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

    // connecting to websocket
    const socket = new WebSocket(`${WS_API}/ws/notifications/${user.id}/`);

    // // sending a confirm msg to the backend [For Testing]
    socket.addEventListener('open', (event) => {
      socket.send('Socket Connection established');
    });

    // Listener to any message coming from the server
    socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      const msg = data.message;
      console.log('Message from server ', msg);
      setUserNotifications((prevMessages) => [...prevMessages, msg]);
      // playNotifyAlert();
      NotificationToast({msg: msg});
    });

    const auto_ord_socket = new WebSocket(`${WS_API}/ws/notifications/${user.id}/confirm_auto_order/`);

    auto_ord_socket.addEventListener('open', (event) => {
      socket.send('Socket Connection established');
    });

    auto_ord_socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      const msg = data.message;
      console.log('Message from server ', msg);

      if (msg === 'confirmation required') {
        setConfirmationAlert((x) => x + 1);
      }
    });
  }, [user.id]);

  const playNotifyAlert = () => {
    const audio = new Audio('notification_sound.mp3');
    audio.play();
  };

  useEffect(() => {
    if (user?.role === 'RETAILER') {
      axios
        .get(`${API}device/get-user-device/`, {withCredentials: true})
        .then((resp) => {
          console.log(resp.data);
          setDeviceId(resp.data.id);
        })
        .catch((err) => console.log(err));
    }
  }, [user.id]);
  const userValues = {
    user,
    setUser,
    userNotifications,
    setUserNotifications,
    confirmationAlert,
    setConfirmationAlert,
    deviceId,
    setDeviceId,
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

export const NotificationToast = ({msg, dur = 10000, colorClass = 'bg-amber-100'}) => {
  toast(msg, {
    unstyled: true,
    cancel: {
      label: 'Cancel',
      onClick: () => toast.dismiss(),
    },
    duration: dur,
    icon: (
      <Iconify-icon
        className='inline'
        icon='line-md:bell-twotone-alert-loop'
        width='24'
        height='24'
        begin='0.8s'
        dur='0.6'
        style={{color: 'grey'}}
      />
    ),
    position: 'top-right',
    classNames: {
      toast: `rounded-lg p-2.5 flex items-center w-full ${colorClass}`,
      title: 'text-muted text-sm ml-2',
    },
  });
};
