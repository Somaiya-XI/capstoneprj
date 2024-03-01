import { Menu } from 'antd';
import "./Supplier.css";
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
                </Menu.Item>
                <Menu.Item key="Schedule" icon={<CalendarOutlined />}>
                    Supply Schedule
                </Menu.Item>
                <Menu.Item key="Home" icon={<PoundCircleOutlined />}>
                    Incoming Orders
                </Menu.Item>
                <Menu.Item key="Settings" icon={<SettingOutlined />}>
                    Settings
                </Menu.Item>
                <Menu.Item key="Logout" icon={<LogoutOutlined />}>
                    Logout
                </Menu.Item>
            </Menu>
        </div>



    );
}

export default MenuList;