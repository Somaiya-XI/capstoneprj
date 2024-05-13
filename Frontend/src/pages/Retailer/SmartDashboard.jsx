import {useEffect, useState} from 'react';
import {Button, Spacer} from '@nextui-org/react';
import {BasicNav, PriceCard, RegisterModal} from '../../Components';
import RetailerLayout from './RetailerLayout';
import {useCsrfContext, useUserContext} from '@/Contexts';
import {API} from '@/backend';
import {DeviceRegister} from '@/pages';
import axios from 'axios';
import SmartOrder from './Orders/SmartOrderTable';

const SmartDashboard = () => {
  const [total, setTotal] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [smartCart, setSmartCart] = useState([]);
  const {deviceId, user} = useUserContext();

  const fetchSmartCart = async () => {
    try {
      const response = await axios.get(`${API}cart/view-smart-cart/`, {
        withCredentials: true,
      });
      const Items = response.data.products;
      console.log('items are ', Items);
      setCartItems((old) => [...Items]);
      setTotal((t) => response.data.total);
      setSmartCart((c) => response.data.cart);
      console.log(response.data);
    } catch (error) {
      console.error(error.response.data);
    }
  };

  useEffect(() => {
    if (user.role === 'RETAILER') {
      fetchSmartCart();
    }
  }, [user]);

  if (!deviceId) {
    return (
      <RetailerLayout>
        <DeviceRegister></DeviceRegister>
      </RetailerLayout>
    );
  } else {
    return (
      <RetailerLayout>
        <div className='mx-4'>
          <div className='retailer-dashboard-cont'>
            <h3 className='d-block font-bold'>Auto Order Cart</h3>
          </div>
          <div className='mt-4'>
            <SmartOrder data={cartItems} total={total}></SmartOrder>
          </div>
        </div>
      </RetailerLayout>
    );
  }
};

export default SmartDashboard;
