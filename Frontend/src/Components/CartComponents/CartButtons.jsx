import axios from 'axios';
import {AiOutlineShoppingCart} from 'react-icons/ai';
import {API} from '../../backend';
import {useCsrfContext, useCartContext} from '../../Contexts';
import {useEffect, useState} from 'react';

function CartButtons({id}) {
  const {csrf, getCsrfToken} = useCsrfContext();
  const {cart, getProductQuantity, UpdateCartContent, fetchCart} = useCartContext();
  const [quant, setQuant] = useState(0);

  useEffect(() => {
    getCsrfToken();
  }, []);

  useEffect(() => {
    cart ? setQuant(getProductQuantity(id)) : setQuant(0);
  }, [cart]);

  return (
    <div className='add-cart'>
      <a
        className='add'
        onClick={() => {
          UpdateCartContent(id, quant + 1);
        }}
      >
        <AiOutlineShoppingCart /> Add
      </a>
    </div>
  );
}

export default CartButtons;
