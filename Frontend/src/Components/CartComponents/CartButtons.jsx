import axios from 'axios';
import {AiOutlineShoppingCart} from 'react-icons/ai';
import {API} from '../../backend';
import {useCsrfContext, useCartContext} from '../../Contexts';
import {useEffect, useState} from 'react';
import {toast} from 'sonner';
import {Link} from 'react-router-dom';

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

  const handleAddToCart = async () => {
    if (cart) {
      try {
        await axios.post(
          `${API}cart/add-to-cart/`,
          {product_id: id, quantity: quant + 1},
          {
            headers: {
              'X-CSRFToken': csrf,
            },
            withCredentials: true,
          }
        );
        setQuant((q) => q + 1);
        // toast.success('product added to cart!');
        toast('item added to cart!', {
          icon: (
            <Iconify-icon
              icon='line-md:circle-to-confirm-circle-twotone-transition'
              width='24'
              height='24'
              begin='0.8s'
              dur='0.6'
              style={{color: ' #008040'}}
            />
          ),
          // action: {
          //   label: <Icon icon='carbon:close-outline' width='1.2em' height='1.2em' />,
          //   onClick: () => toast.dismiss,
          // },
        });
      } catch (error) {
        console.error(error);
      }
      console.log(`quant is${quant}`);
    } else {
      toast.error('you have to login to add to cart');
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

export default CartButtons;
