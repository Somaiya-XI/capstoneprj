import {useState} from 'react';
import {Layout, Button} from 'antd';
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, NextUIProvider, User, Spacer} from '@nextui-org/react';

import { WiserLogo as Logo, WLogo } from './Logo';
import {Search, ChevronLeft, ChevronRight, Bell} from 'lucide-react';
import {useUserContext} from '@/Contexts';
import {useNavigate} from 'react-router-dom';
import {imgURL} from '@/backend';
import MenuList from './MenuList';
const {Header, Sider} = Layout;

const SupplierLayout = ({children}) => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const {user} = useUserContext();
  return (
    <NextUIProvider>
      <Layout className='h-100vh '>
        <Sider collapsed={collapsed} collapsible trigger={null}>
          <div className='flex align-items-center my-0 px-0 cursor-pointer' onClick={() => navigate('/')}>
            {collapsed ? <WLogo fontSize='10px' /> : <Logo />}
          </div>
          <MenuList collabsed={collapsed}></MenuList>
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
                      showFallback: true,
                      src: `${imgURL}${user.profile_picture}`,
                      classNames: {img: user.profile_picture ? 'opacity-1' : 'opacity-0'},
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

export default SupplierLayout;

