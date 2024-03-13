import {API} from '../../backend';
import {Link} from 'react-router-dom';
import './CartItem.css';
import {useEffect, useState} from 'react';
import axios from 'axios';
import {useCsrfContext} from '../../Contexts';
import BinIcon from './BinIcon';
const CartItem = ({image, id, product_name, unit_price, subtotal, quantity, reloadCart, remove, add}) => {
  const [qty, setQty] = useState(quantity);
  const [subTot, setSubTot] = useState(subtotal);

  const {csrf} = useCsrfContext();

  useEffect(() => {
    const newSubtotal = qty * unit_price;
    setSubTot(newSubtotal);
  }, [qty, unit_price]);

  const handleQuantityChange = (newQuantity) => {
    setQty(newQuantity);
    add(id, newQuantity);
  };

  const decreaseQuantity = () => {
    const newQuantity = qty - 1;
    if (newQuantity >= 1) {
      handleQuantityChange(newQuantity);
    }
  };

  const increaseQuantity = () => {
    const newQuantity = qty + 1;
    handleQuantityChange(newQuantity);
  };

  const handleInputChange = (event) => {
    const newQuantity = parseInt(event.target.value);
    if (!isNaN(newQuantity) && newQuantity >= 1) {
      handleQuantityChange(newQuantity);
    } else {
      handleQuantityChange(1);
    }
  };

  const handleRemoveItem = () => {
    console.log('Item:', id);
    console.log('csrf:', csrf);
    remove(id);
  };

  return (
    <div className='cart-item'>
      <ul className='item-flex-container'>
        <li className='img-cont'>
          <div className='image-container'>{image && <img src={`${API}${image}`} alt={product_name} />}</div>
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
          <input type='number' value={qty} min='1' lang='en' onChange={handleInputChange} />
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
