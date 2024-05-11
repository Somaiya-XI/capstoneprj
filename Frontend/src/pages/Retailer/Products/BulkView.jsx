import RetailerLayout from '../RetailerLayout';
import '../retailer.css';
import ProductBulkTable from './BulkTable';
import AutoOrderConfigView from './AutoOrderConfigView';
import {useParams} from 'react-router-dom';
import {useState} from 'react';

const BulkView = () => {
  const {product_id} = useParams();
  console.log('ID IS', product_id);
  const [productName, setProductName] = useState('');

  return (
    <RetailerLayout>
      <div className='mx-4'>
        <div className='retailer-dashboard-cont'>
          <h3 className='d-block font-bold'>Bulks Of Product {productName}</h3>
        </div>
        <div className='mt-4'>
          <ProductBulkTable product_id={product_id} setProductName={setProductName}></ProductBulkTable>
        </div>
        <div className='retailer-dashboard-cont'>
          <h3 className='d-block font-bold'>Auto-order Configuration of {productName}</h3>
        </div>
        <div className='mt-4'>
          <AutoOrderConfigView product_id={product_id} />
        </div>
      </div>
    </RetailerLayout>
  );
};

export default BulkView;
