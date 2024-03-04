import { Menu } from 'antd';
import "./Supplier.css";
import { Link } from 'react-router-dom';
import { logout } from '../../Account/AuthHelpers';


import {
    SettingOutlined,
    ProductOutlined,
    LogoutOutlined,
    PoundCircleOutlined,
    CalendarOutlined,
} from '@ant-design/icons'
import Products from './Products';

function MenuList() {
    return (
        <div>
            <Menu theme="dark" mode="inline" className="menu-bar">
                <Menu.Item key="Products" icon={<ProductOutlined />}>
                    Products
                    <Link to="/SupplierDashboard" />
                </Menu.Item>
                <Menu.Item key="Schedule" icon={<CalendarOutlined />}>
                    Supply Schedule
                </Menu.Item>
                <Menu.Item key="Incoming Orders" icon={<PoundCircleOutlined />}>
                    Incoming Orders
                </Menu.Item>
                <Menu.Item key="Settings" icon={<SettingOutlined />}>
                    Settings
                    <Link to="/profile"/>
                </Menu.Item>
                <Menu.Item key="Logout" icon={<LogoutOutlined />} onClick={() => {
                    logout();
                }}>
                    Logout
                    <Link to="/login" />

                </Menu.Item>
            </Menu>
        </div>



    );
}

export default MenuList;