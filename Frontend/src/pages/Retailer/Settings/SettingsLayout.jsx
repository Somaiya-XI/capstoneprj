import React from 'react';
import RetailerLayout from '../RetailerLayout';
import NotificationCard from './NotificationsCard';
import AutoOrderConfigCard from './AutoOrderConfigCard'


const SettingsLayout = () => {
  return (
    <RetailerLayout>
      <div className='mx-4'>
        <div className='retailer-dashboard-cont'>
          <h3 className='d-block font-bold'>Settings</h3>
        </div>
        <div className='mt-4'>
          <NotificationCard/>     
        </div>
        <div className='mt-4'>
        <AutoOrderConfigCard/>
        </div>
      </div>
    </RetailerLayout>
  )
}

export default SettingsLayout
