import { Menu } from 'antd';
import "./Supplier.css";
import {
    HomeOutlined,
    SettingOutlined,
    ProductOutlined,
    LogoutOutlined
} from '@ant-design/icons'
import Products from './Products';

function MenuList() {
    return (
        <div>
            <Menu theme="dark" mode="inline" className="menu-bar">
                {/* <Menu.Item key="Home" icon={<HomeOutlined />}>
                    Dashboard
                </Menu.Item> */}
                <Menu.Item key="Products" icon={<ProductOutlined />}>
                    Products
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