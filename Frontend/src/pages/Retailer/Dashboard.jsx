import React from 'react';
import SideNavbar from './SideNav';
import RetailerLayout from './RetailerLayout';
import './retailer.css';
import SuperMarketProducts from './ProductsTable';
import {Button} from '@nextui-org/react';
import {Link} from 'react-router-dom';

const RetDashboard = () => {
  return (
    <RetailerLayout>
      <div className='mx-4'>
        <div className='retailer-dashboard-cont'>
          <h3 className='d-block'>Products</h3>
          <Button className='AddButton retailer-link-btn' type='primary'>
            <Link to='/retailer-dashboard/products/add'>+ Add </Link>
          </Button>
        </div>
        <div className='mt-4'>
          <SuperMarketProducts></SuperMarketProducts>
        </div>
      </div>
    </RetailerLayout>
  );
};

export default RetDashboard;
