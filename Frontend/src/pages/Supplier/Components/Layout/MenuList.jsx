import { Menu } from 'antd';
import "./Supplier.css";
import { Link } from 'react-router-dom';


import {
    SettingOutlined,
    ProductOutlined,
    LogoutOutlined,
    PoundCircleOutlined,
    CalendarOutlined,
} from '@ant-design/icons'
import { useCsrfContext } from '../../../../Contexts';


function MenuList() {
    const {logUserOut} = useCsrfContext();

    return (
        <div>

{/* <Route path='/supplier-dashboard/products' element={<SupplierRoute><Products /></SupplierRoute>} />
                  <Route path='/supplier-dashboard/products:edit/:id' element={<EditProduct />} />
                  <Route path='/supplierdashboard/products:add' element={<AddProduct />}/>
                  <Route path='/supplier-dashboard/schedule' element={<ScheduleView />} />
                  <Route path='/supplier-dashboard/schedule:add'element={<SupplierRoute><Schedule /></SupplierRoute>} />
                  <Route path='/supplier-dashboard/schedule:edit'element={<SupplierRoute></SupplierRoute>} /> */}

            <Menu theme="dark" mode="inline" className="menu-bar">
                <Menu.Item key="Products" icon={<ProductOutlined />}>
                    Products
                    <Link to="/supplier-dashboard/products" />
                </Menu.Item>
                <Menu.Item key="Schedule" icon={<CalendarOutlined />}>
                    Supply Schedule
                    <Link to="/supplier-dashboard/schedule"/>
                </Menu.Item>
                {/* <Menu.Item key="Incoming Orders" icon={<PoundCircleOutlined />}>
                    Incoming Orders
                    <Link to="/SupplierDashboard/Orders"/>
                </Menu.Item> */}
                <Menu.Item key="Settings" icon={<SettingOutlined />}>
                    Settings
                    <Link to="/profile"/>
                </Menu.Item>
                <Menu.Item key="Logout" icon={<LogoutOutlined />} onClick={() => {
                    logUserOut();
                }}>
                    Logout
                    <Link to="/login" />

                </Menu.Item>
            </Menu>
        </div>



    );
}

export default MenuList;