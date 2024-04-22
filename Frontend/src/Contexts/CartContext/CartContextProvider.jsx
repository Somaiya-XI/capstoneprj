import {useState, useContext, useEffect} from 'react';
import CartContext from './CartContext';
import axios from 'axios';
import {API} from '../../backend';
import {useCsrfContext} from '../CsrfTokenContext/CsrfTokenContextProvider';
import {useUserContext} from '../index';

const CartContextProvider = ({children}) => {
  const {csrf} = useCsrfContext();
  const {user} = useUserContext();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const response = await axios.get(`${API}cart/view-cart/`, {
        withCredentials: true,
      });
      const {data} = response;
      console.log(data);
      setCart((cart) => data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const reloadCart = () => {
    if (user.role === 'RETAILER') {
      fetchCart();
    }
  };

  useEffect(() => {
    if (!cart && user.role == 'RETAILER') {
      console.log('cart fetched');
      fetchCart();
    }
  }, [user]);

  const getProductQuantity = (productId) => {
    const product = cart?.products?.find((item) => item.product_id === productId);
    return product ? product.quantity : 0;
  };

  const setProductQuantity = (productId, newQty) => {
    const updatedProducts = cart?.products?.map((item) => {
      if (item.product_id === productId) {
        return {...item, quantity: newQty, subtotal: item.price * newQty};
      }
      return item;
    });

    if (updatedProducts) {
      setCart({...cart, products: updatedProducts});
    }
  };

  const UpdateCartContent = async (id, quantity) => {
    try {
      setProductQuantity(id, quantity);
      await axios.post(
        `${API}cart/add-to-cart/`,
        {product_id: id, quantity: quantity},
        {
          headers: {
            'X-CSRFToken': csrf,
          },
          withCredentials: true,
        }
      );
      console.log('Item updated:', id);
    } catch (error) {
      console.error(error);
    }
  };

  const cartValues = {
    cart,
    setCart,
    getProductQuantity,
    setProductQuantity,
    fetchCart,
    loading,
    UpdateCartContent,
    reloadCart,
  };

  return <CartContext.Provider value={cartValues}>{children}</CartContext.Provider>;
};

export default CartContextProvider;

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('context must be used in context provider');
  }
  return context;
}
