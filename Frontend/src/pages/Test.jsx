import axios from 'axios';
import {useCsrfContext, useUserContext} from '../Contexts';
import {useEffect, useState} from 'react';
import {API} from '../backend';
import {toast} from 'sonner';
import '../index.css';
const ApiTest = () => {
  useEffect(() => {
    document.body.style.backgroundColor = 'rgb(23 23 23)';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  const {user} = useUserContext();
  const {ax} = useCsrfContext();
  const [products, setProducts] = useState(null);
  // // option2:

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API}product/get-user-products/${user.id}/`, {
        withCredentials: true,
      });
      const {data} = response;
      console.log(data);
      setProducts(data);
    } catch (error) {
      console.error(error);
    }
  };
  // // option1:
  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreateProduct = async () => {
    try {
      const response = await ax.post(`${API}product/catalog/create/`, {
        product_name: 'Passion Fruit Yogurt',
        price: 15,
        quantity: 120,
        description: ' ',
        product_img: '',
        brand: 'Almarai',
        category: 'Dairy',
        expiry_date: '2024-11-11',
        production_date: '2024-11-11',
      });
      console.log('response: ', response);
      return response;
    } catch (error) {
      toastError();
      console.error(error);
    }
  };
  const handleCreateSchedule = async () => {
    console.log('user id: ', user.id);
    try {
      const response = await ax.post(`${API}schedule/create/`, {
        day: 'tue',
        time: '01:03:04',
      });
      console.log('response: ', response);
      return response;
    } catch (error) {
      toastError();
      console.error(error);
    }
  };
  const handleDeleteSchedule = async () => {
    try {
      const response = await ax.post(`${API}schedule/delete/`, {
        id: 7,
      });
      console.log('response: ', response);
      return response;
    } catch (error) {
      toastError();
      console.error(error);
    }
  };
  const handleUpdateProduct = async () => {
    try {
      const response = await ax.put(`${API}product/catalog/update/`, {
        id: '07886aed-2e38-4d72-aea9-5439279bbb52',
        product_name: 'Product Upadte Name',
      });
      console.log('response: ', response);
      return response;
    } catch (error) {
      toastError();
      console.error(error);
    }
  };

  const handleDeleteProduct = async () => {
    try {
      const response = await ax.delete(`${API}product/catalog/update/`, {
        data: {id: '07886aed-2e38-4d72-aea9-5439279bbb52'},
      });
      console.log('response: ', response);
      return response;
    } catch (error) {
      toastError();
      console.error(error);
    }
  };

  const handleMakeOrder = async () => {
    try {
      const response = await axios.post(
        `${API}order/make-order/`,
        {
          payment_method: 'credit_card',
          shipping_address: 'city, district',
        },
        {
          headers: {
            'X-CSRFToken': csrf,
          },
          withCredentials: true,
        }
      );
      console.log('response: ', response);
      return response;
    } catch (error) {
      toastError();
      console.error(error);
    }
  };

  const handleCancelOrder = async () => {
    try {
      const response = await axios.post(
        `${API}order/cancel-order/`,
        {
          order_id: 'da696339-3733-4fef-a8bd-dea73475a9e1',
        },
        {
          headers: {
            'X-CSRFToken': csrf,
          },
          withCredentials: true,
        }
      );
      console.log('response: ', response);
      return response;
    } catch (error) {
      toastError();
      console.error(error);
    }
  };
  return (
    <div className='d-flex align-items-center justify-content-center' style={{height: '100vh'}}>
      <button className='btn bg-amber-50 mr-2 bg-light' onClick={handleCreateProduct}>
        Create Product
      </button>
      <button className='btn bg-indigo-100 mr-2 bg-light' onClick={handleUpdateProduct}>
        Update Product
      </button>
      <button className='btn bg-rose-50 mr-2 bg-light' onClick={handleDeleteProduct}>
        Delete Product
      </button>
      <button className='btn bg-emerald-50 mr-2 bg-light' onClick={handleCreateSchedule}>
        Create Schedule
      </button>
      <button className='bg-sky-100 mr-2 btn bg-light' onClick={handleDeleteSchedule}>
        Delete Schedule
      </button>
      <button className='btn bg-sky-100 mr-2 bg-light' onClick={handleMakeOrder}>
        Make Order
      </button>
      <button className='btn bg-sky-100 mr-2 bg-light' onClick={handleCancelOrder}>
        Cancle Order
      </button>
    </div>
  );
};

export default ApiTest;

export function toastError() {
  return toast.error('Server Error! Your not authenticated', {
    duration: 1500,
    position: 'bottom-left',
    style: {background: 'rgb(254 242 242)'},
    className: 'text-dark',
    icon: (
      <Iconify-icon
        className='inline'
        icon='line-md:alert-circle-twotone'
        width='24'
        height='24'
        begin='0s'
        dur='0.6'
        style={{color: ' rgb(127, 29, 29)'}}
      />
    ),
  });
}
