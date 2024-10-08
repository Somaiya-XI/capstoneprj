import {API, imgURL} from '../../backend';
import {Link} from 'react-router-dom';
import './CartItem.css';
import {useEffect, useState} from 'react';
import BinIcon from './BinIcon';
import {toast} from 'sonner';
import {CustomErrorToast} from '@/Components';

const CartItem = ({image, id, product_name, unit_price, subtotal, quantity, min_qyt, stock, remove, add}) => {
  const [qty, setQty] = useState(quantity);
  const [subTot, setSubTot] = useState(subtotal);

  useEffect(() => {
    const newSubtotal = qty * unit_price;
    setSubTot(newSubtotal);
  }, [qty, unit_price]);

  const handleQuantityChange = (newQuantity) => {
    setQty(newQuantity);

    if (newQuantity !== '' && newQuantity >= min_qyt && newQuantity <= stock) {
      add(id, newQuantity);
    }
  };
  const decreaseQuantity = () => {
    const newQuantity = qty - 1;
    if (newQuantity >= min_qyt) {
      handleQuantityChange(newQuantity);
    }
    if (newQuantity < min_qyt) {
      CustomErrorToast({
        msg: `You cannot add less than ${min_qyt} of this product`,
        position: 'top-right',
        shiftStart: 'ms-0',
      });
    }
  };

  const increaseQuantity = () => {
    const newQuantity = qty + 1;
    if (newQuantity <= stock) {
      handleQuantityChange(newQuantity);
    }
    if (newQuantity > stock) {
      CustomErrorToast({
        msg: `Over the stock, you cannot add more than ${stock}`,
        position: 'top-right',
        shiftStart: 'ms-0',
      });
    }
  };

  const handleInputChange = (event) => {
    const inputValue = event.target.value.trim();
    if (inputValue === '') {
      handleQuantityChange('');
    } else {
      const newQuantity = parseInt(inputValue);
      if (!isNaN(newQuantity) && newQuantity >= min_qyt && newQuantity <= stock) {
        handleQuantityChange(newQuantity);
      } else if (newQuantity > stock) {
        handleQuantityChange(stock);
      } else {
        handleQuantityChange(min_qyt);
      }
    }
  };

  const handleRemoveItem = async () => {
    const res = await remove(id);
    console.log('res: ', res);
    const message = res.data.message;

    toast.info(message, {duration: 1500});
  };

  return (
    <div className='cart-item'>
      <div className='card flex justify-content-center'></div>
      <ul className='item-flex-container'>
        <li className='img-cont'>
          <div className='image-container'>{image && <img src={`${imgURL}${image}`} alt={product_name} />}</div>
        </li>
        <li className='product-name'>
          <h4>
            <Link to={`/${id}`}>{product_name}</Link>
          </h4>
        </li>
        <li className='unit-price'>
          <h4>{Number(unit_price).toFixed(2)}</h4>
        </li>
        <li className='quantity'>
          <span className='btn-span' onClick={decreaseQuantity}>
            -
          </span>
          <input type='number' value={qty} lang='en' onChange={handleInputChange} />
          <span className='btn-span' onClick={increaseQuantity}>
            +
          </span>
        </li>
        <li className='subtotal'>
          <h4>{subTot}</h4>
        </li>
        <li className='trash-icon'>
          <h4>
            <BinIcon className='btn-span' height='1.5rem' width='1.5rem' onClick={handleRemoveItem} />
          </h4>
        </li>
      </ul>
    </div>
  );
};

export default CartItem;
