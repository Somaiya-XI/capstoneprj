import {useState} from 'react';
import {Layout, Button} from 'antd';
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, NextUIProvider, User, Spacer} from '@nextui-org/react';

import {WiserLogo as Logo, WLogo} from '../Supplier/Components/Layout/Logo';
import SideNavbar from './SideNav';
import {Search, ChevronLeft, ChevronRight, Bell} from 'lucide-react';
import {useUserContext} from '@/Contexts';
const {Header, Sider} = Layout;

const RetailerLayout = ({children}) => {
  const [collapsed, setCollapsed] = useState(false);
  const {user} = useUserContext();
  return (
    <NextUIProvider>
      <Layout className='h-100vh'>
        <Sider collapsed={collapsed} collapsible trigger={null}>
          <div className='flex align-items-center my-0 px-0'>{collapsed ? <WLogo fontSize='10px' /> : <Logo />}</div>
          <SideNavbar collabsed={collapsed}></SideNavbar>
        </Sider>

        <Layout>
          <Header className='Fold'>
            <Button
              type='text'
              className='toggle'
              onClick={() => setCollapsed((c) => !collapsed)}
              icon={collapsed ? <ChevronRight /> : <ChevronLeft />}
            />

            <div className='mr-12 mt-3 flex justify-center align-center'>
              <div className='inline-flex justify-content-center align-items-center'>
                <Bell />
                <Spacer x={6}></Spacer>
              </div>
              <Dropdown placement='bottom-start' offset={12} showArrow containerPadding={0} disableAnimation>
                <DropdownTrigger>
                  <User
                    avatarProps={{
                      isBordered: true,
                      src: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
                    }}
                    description={user.email}
                    name={user.company_name}
                  />
                </DropdownTrigger>
                <DropdownMenu aria-label='Static Actions' variant='flat' className='retailer-link-drop'>
                  <DropdownItem key='new' href='/Profile'>
                    Profile
                  </DropdownItem>
                  <DropdownItem key='logout' className='data-[hover=true]:bg-rose-50 data-[pressed=true]:opacity-70'>
                    Log Out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </Header>
          {children}
        </Layout>
      </Layout>
    </NextUIProvider>
  );
};

export default RetailerLayout;
