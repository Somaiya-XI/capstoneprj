import UserContext from './UserContext';
import {useState, useContext, useEffect} from 'react';
import {WS_API} from '@/backend';
import {toast} from 'sonner';

const UserContextProvider = ({children}) => {
  const [userNotifications, setUserNotifications] = useState([]);
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
  }, [user]);

  const playNotifyAlert = () => {
    const audio = new Audio('notification_sound.mp3');
    audio.play();
  };

  const userValues = {
    user,
    setUser,
    userNotifications,
    setUserNotifications,
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
