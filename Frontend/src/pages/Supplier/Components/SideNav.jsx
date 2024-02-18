import {Layout} from 'antd';
const {Header, Sider} = Layout;


import Logo from './Logo';
import MenuList from './MenuList';
function SideNav() {
    return (
        <>
        <Layout>
            <Sider className="sidebar"><Logo></Logo>
            <MenuList/>
            </Sider>
        </Layout>
        </>
        
    );
  }
  
  export default SideNav;