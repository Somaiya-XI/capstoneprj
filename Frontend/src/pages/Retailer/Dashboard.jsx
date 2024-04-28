import {useState, useEffect} from 'react';
import SideNavbar from './SideNav';
import RetailerLayout from './RetailerLayout';
import './retailer.css';
import SuperMarketProducts from './ProductsTable';
import {Button} from '@nextui-org/react';
import {Link} from 'react-router-dom';
import {useCsrfContext, useUserContext} from '@/Contexts';
import {API} from '@/backend';

const RetDashboard = () => {
  return (
    <RetailerLayout>
      <div className='mx-4'>
        <div className='retailer-dashboard-cont'>
          <h3 className='d-block font-bold'>Dashboard</h3>
        </div>
        <div className='mt-4'>your dashboard ... </div>
      </div>
    </RetailerLayout>
  );
};

export default RetDashboard;
