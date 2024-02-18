import { useState } from 'react';
import { Button, Layout } from 'antd';
const { Header, Sider } = Layout;
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined
}
    from '@ant-design/icons'

import Logo from './Logo';
import MenuList from './MenuList';
function SideNav() {
    const [collapsed, setCollapsed] = useState(false)
    
    return (
        
            <Layout>
                <Sider collapsed= {collapsed} 
                collapsible 
                trigger={null}
                className="sidebar"><Logo/>
                    <MenuList />
                </Sider>
                <Layout>
                    <Header className="Fold">
                        <Button type='text' 
                         className='toggle'
                         onClick={()=> setCollapsed(!collapsed)}
                         icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined/> } />
                    </Header>
                </Layout>
            </Layout>
        

    );
}

export default SideNav;