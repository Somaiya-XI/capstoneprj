import axios from 'axios';
import {AiOutlineShoppingCart} from 'react-icons/ai';
import {API} from '../../backend';
import {useCsrfContext, useCartContext, useUserContext} from '../../Contexts';
import {useEffect, useState} from 'react';
import {toast} from 'sonner';
import {Link} from 'react-router-dom';
import {CustomSuccessToast, CustomErrorToast} from '../index';

function CartButton({id}) {
  const {csrf, isAuthenticated} = useCsrfContext();
  const {cart, getProductQuantity, setProductQuantity, UpdateCartContent, reloadCart} = useCartContext();
  const [quant, setQuant] = useState(0);

  useEffect(() => {
    cart ? setQuant(getProductQuantity(id)) : setQuant(0);
  }, [cart]);

  const handleAddToCart = async () => {
    if (cart) {
      try {
        const resp = await axios.post(
          `${API}cart/add-to-cart/`,
          {product_id: id, quantity: quant + 1},
          {
            headers: {
              'X-CSRFToken': csrf,
            },
            withCredentials: true,
          }
        );
        CustomSuccessToast({msg: 'item added to cart!', position: 'top-right', shiftStart: 'ms-0'});
        console.log(resp.data);
      } catch (error) {
        const msg = error.response.data.message;
        CustomErrorToast({msg: msg, position: 'top-right', shiftStart: 'ms-0'});
      }
      console.log(`quant is${quant}`);
    } else {
      let m = '';
      if (!isAuthenticated) {
        m = 'Please log in to add to cart';
      } else {
        m = 'You are not allowed to add to cart';
      }
      toast.error(m, {
        duration: 2300,
        style: {background: '#fef2f2'},
        className: 'text-dark',
      });
    }
    reloadCart();
    const product = cart?.products?.find((p) => p.product_id === id) ?? null;
    if (product) {
      console.log('after reload', product);
      setProductQuantity(id, product.quantity);
    }
  };

  return (
    <div className='add-cart'>
      <Link className='add' onClick={handleAddToCart}>
        <Iconify-icon inline icon='solar:cart-plus-outline' width='20' height='20'></Iconify-icon>
        Add
      </Link>
    </div>
  );
}

export default CartButton;
