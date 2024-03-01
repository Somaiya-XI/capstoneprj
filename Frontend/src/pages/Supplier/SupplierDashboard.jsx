import { useState } from 'react';
import { Button, Layout, Input, Avatar, Space, Dropdown, Divider } from 'antd';

const { Header, Sider } = Layout;
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  SearchOutlined,
  UserOutlined,
  NotificationOutlined,


}
  from '@ant-design/icons'

import Logo from './Components/Logo';
import MenuList from './Components/MenuList';
import Products from './Components/Products';
import DashboardHeader from './Components/DashboardHeader';
function SupplierDashboard() {
  const [collapsed, setCollapsed] = useState(false)
  const url = 'https://avatars.githubusercontent.com/u/85838482?v=4';
  const items = [
    {
      key: '1',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
          Account
        </a>
      ),
    },

    {
      key: '2',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
          ----
        </a>
      ),
    },
    {
      key: '3',
      danger: true,
      label: 'Sign Out',
    },

  ]

  return (

    <Layout>
      <Sider collapsed={collapsed}
        collapsible
        trigger={null}
        className="sidebar"><Logo />
        <MenuList />
      </Sider>
      <Layout>
        <Header className="Fold">
          <Button type='text'
            className='toggle'
            onClick={() => setCollapsed(!collapsed)}
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} />

          <Space wrap size={50} className="Profile">
            <Space wrap size={100} className="Search">
              <SearchOutlined />
            </Space>
            <Space wrap size={100} className="Notification" >
              <NotificationOutlined />
            </Space>
            <Space>
            <Dropdown menu = {{items,}}>
              <Avatar size={42} icon={<UserOutlined />} src={url} onClick={(e) => e.preventDefault()}>
            </Avatar>
            </Dropdown>
            </Space>
            </Space>
        </Header>
        <Layout>

          <Products />
        </Layout>
      </Layout>
    </Layout>


  );
}

export default SupplierDashboard;

