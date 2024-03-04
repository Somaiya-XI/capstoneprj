import { useState } from 'react';
import { Button, Layout, Input, Avatar, Space, Dropdown, Divider } from 'antd';
const { Header } = Layout;
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  SearchOutlined,
  UserOutlined,
  NotificationOutlined,


}
  from '@ant-design/icons'


const SupplierHeader = () => {
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
      key: '3',
      color: (<h1> hmm</h1>),
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com" color="red">
          Sign Out
        </a>
      ),
    },

  ]
  return (
    
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
          <Dropdown menu={{ items, }}>
            <Avatar size={42} icon={<UserOutlined />} src={url} onClick={(e) => e.preventDefault()}>
            </Avatar>
          </Dropdown>
        </Space>
      </Space>
    </Header>




  )
}

export default SupplierHeader
