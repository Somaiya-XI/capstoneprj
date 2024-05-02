import {useEffect} from 'react';
import {Button, Spacer} from '@nextui-org/react';
import {BasicNav, PriceCard, RegisterModal} from '../../Components';
import RetailerLayout from '../Retailer/RetailerLayout';

const DeviceRegister = () => {
  const main = 'Step into the world of smart automation with RFID technology and explore the hidden possibilities..';
  const Body = (n) => {
    return `Suitable for +${n} shelves`;
  };

  const postBody = 'xxx$';

  return (
    <RetailerLayout>
      <div className='px-3 py-3 mx-auto text-center'>
        <h1 className='display-4'>Pricing</h1>
        <p className='lead'>Start now by ordering your preferred set </p>
      </div>
      <div className='container '>
        <div className='px-3 py-2  mx-auto text-center justify-between flex'>
          <PriceCard
            Title='Starter Bundle'
            SubTitle='Perfect for your small shop!'
            mainBody={main}
            Body={Body(100)}
            postBody={postBody}
          ></PriceCard>
          <Spacer x={6} />
          <PriceCard
            Title='Advanced Bundle'
            SubTitle='Elevate your business to the next level!'
            mainBody={main}
            Body={Body(300)}
            postBody={postBody}
          ></PriceCard>
          <Spacer x={6} />
          <PriceCard
            Title='Premium Bundle'
            SubTitle='Unleash the full potential of your marketplace!'
            mainBody={main}
            Body={Body(500)}
            postBody={postBody}
          ></PriceCard>
        </div>
      </div>
      <div className='px-3 py-3 pt-md-5 mx-auto flex align-items-center justify-content-center text-center'>
        <p className='text-lg my-0 font-semibold'>already a member? register your device</p>
        <RegisterModal />
      </div>
    </RetailerLayout>
  );
};

export default DeviceRegister;
