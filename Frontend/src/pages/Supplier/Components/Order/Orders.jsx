import { useState } from 'react';
import { Button, Layout, Avatar, Space, Dropdown } from 'antd';
import { Link } from 'react-router-dom';
import OrdersTable from './OrdersTable';

import SearchField from '../Layout/SearchField';
const { Header, Sider } = Layout;
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    SearchOutlined,
    UserOutlined,
    NotificationOutlined,


}
    from '@ant-design/icons'

import "./Supplier.css";
import Logo from '../Layout/Logo';
import MenuList from '../Layout/MenuList';
import Products from './Products';
const Orders = () => {
    const [collapsed, setCollapsed] = useState(false)
    const url = 'https://avatars.githubusercontent.com/u/85838482?v=4';
    const items = [
        {
            key: '1',
            label: (
                <Link to="/profile">Account</Link>
            ),

        },

        {
            key: '3',
            label: (
                <Link to="/login" onClick={() => {
                    logout();
                }}>Logout</Link>
            ),
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
                            <Dropdown menu={{ items, }}>
                                <Avatar size={42} icon={<UserOutlined />} src={url} onClick={(e) => e.preventDefault()}>
                                </Avatar>
                            </Dropdown>
                        </Space>
                    </Space>

                </Header >
                


                <div className="SupplierDashboard">
                    <div className="DashboardContent">
                        
                        <h3 className="HeaderTitle">Orders</h3>

                    </div>
                    <SearchField/>
                    <OrdersTable />




                </div>

             







            </Layout>
        </Layout >







    )
}

export default Orders