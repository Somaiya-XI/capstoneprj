import { Outlet } from 'react-router-dom';
import { AccountContext } from './AccountContext';

const UserLayout = () => {
  return (
    <AccountContext>
      <Outlet />
    </AccountContext>
  );
};

export default UserLayout;
