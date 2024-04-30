import {useState, useEffect} from 'react';
import RetailerLayout from './RetailerLayout';
import './retailer.css';
import SuperMarketProducts from './ProductsTable';
import {useCsrfContext, useUserContext} from '@/Contexts';
import {API} from '@/backend';

const ProductView = () => {
  const [load, setLoad] = useState(0);
  const {ax} = useCsrfContext();
  const {user} = useUserContext();
  const [data, setData] = useState([]);
  const fetchProducts = async () => {
    try {
      const response = await ax.get(`${API}product/get-ret-products/${user.id}/`);
      const productsWithKeys = response.data.map((product) => ({
        ...product,
        key: product.product_id,
      }));

      setData(productsWithKeys);
      console.log(productsWithKeys);
    } catch (error) {
      console.error(error.data);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [load]);

  return (
    <RetailerLayout>
      <div className='mx-4'>
        <div className='retailer-dashboard-cont'>
          <h3 className='d-block font-bold'>Product List</h3>
        </div>
        <div className='mt-4'>
          <SuperMarketProducts data={data} setLoad={setLoad}></SuperMarketProducts>
        </div>
      </div>
    </RetailerLayout>
  );
};

export default ProductView;
