import {API} from '../../backend';
import {useCsrfContext, useCartContext, useUserContext} from '../../Contexts';
import {useEffect, useState} from 'react';
import {toast} from 'sonner';
import {CustomSuccessToast, CustomErrorToast} from '../index';
import {Button} from '@nextui-org/react';

function CartButton({id, minAllowed, stock}) {
  const {isAuthenticated, ax} = useCsrfContext();
  const {cart, getProductQuantity, setProductQuantity, UpdateCartContent, reloadCart} = useCartContext();
  const [quant, setQuant] = useState(0);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  useEffect(() => {
    cart ? setQuant(getProductQuantity(id)) : setQuant(0);
  }, [cart]);

  useEffect(() => {
    console.log('order quant', minAllowed);
    console.log('order quant', stock);

    if (minAllowed > stock || stock === 0) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  }, [minAllowed, stock]);

  const handleAddToCart = async () => {
    if (cart && !buttonDisabled) {
      try {
        const resp = await ax.post(`${API}cart/add-to-cart/`, {product_id: id, quantity: quant + 1});
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
      }
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
      <Button
        onPress={handleAddToCart}
        isDisabled={buttonDisabled}
        className='add'
        startContent={<Iconify-icon inline icon='solar:cart-plus-outline' width='20' height='20' />}
      >
        Add
      </Button>
      {/* <Link className='add' onClick={buttonDisabled ? null : handleAddToCart} disabled={buttonDisabled}>
        <Iconify-icon inline icon='solar:cart-plus-outline' width='20' height='20' />
        Add
      </Link> */}
    </div>
  );
}

export default CartButton;
