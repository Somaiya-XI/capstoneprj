import {useEffect, useState} from 'react';
import {toast} from 'sonner';

const NotificationComponent = () => {
  const [notification, setNotification] = useState('');
  useEffect(() => {
    document.body.style.backgroundColor = 'rgb(23 23 23)';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  useEffect(() => {
    // connecting to websocket
    const socket = new WebSocket('ws://localhost:8000/ws/notifications/');

    // sending a confirm msg to the backend [For Testing]

    // socket.addEventListener('open', (event) => {
    //   socket.send('Socket Connection established');
    // });

    // Listener to any message coming from the server
    socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      const msg = data.message;
      console.log('Message from server ', msg);
      setNotification((n) => msg);
      toast.success(msg);
    });
  }, []);

  return (
    <div className='d-flex align-items-center justify-content-center' style={{height: '100vh'}}>
      {notification && <p className='text-white'>{notification}</p>}
    </div>
  );
};

export default NotificationComponent;
