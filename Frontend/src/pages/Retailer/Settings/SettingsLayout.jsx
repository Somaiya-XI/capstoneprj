import React from 'react';
import RetailerLayout from '../RetailerLayout';
import NotificationCard from './NotificationsCard';


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
      </div>
    </RetailerLayout>
  )
}

export default SettingsLayout
