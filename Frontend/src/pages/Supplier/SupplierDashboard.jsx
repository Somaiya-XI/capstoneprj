import { useState } from 'react';
import { Button, Layout, Input } from 'antd';
const { Header, Sider } = Layout;
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  
}
  from '@ant-design/icons'

import Logo from './Components/Logo';
import MenuList from './Components/MenuList';
import Products from './Components/Products';
import DashboardHeader from './Components/DashboardHeader';
function SupplierDashboard() {
  const [collapsed, setCollapsed] = useState(false)

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
          <Input className="Search-box"
            placeholder="Search .."
            style={{ width: 200 }}
            onSearch={value => console.log(value)} />

        </Header>
        <Layout>
          
          <Products />
        </Layout>
      </Layout>
    </Layout>


  );
}

export default SupplierDashboard;

