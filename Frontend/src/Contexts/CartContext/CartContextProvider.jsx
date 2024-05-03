import {useState, useContext, useEffect} from 'react';
import CartContext from './CartContext';
import {API} from '../../backend';
import {useCsrfContext, useUserContext} from '../index';

const CartContextProvider = ({children}) => {
  const {ax, isAuthenticated} = useCsrfContext();
  const {user} = useUserContext();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const response = await ax.get(`${API}cart/view-cart/`);
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
  }, []);

  const getProductQuantity = (productId) => {
    const product = cart?.products?.find((item) => item.product_id === productId);
    return product ? product.quantity : 0;
  };

  const UpdateCartContent = async (id, quantity) => {
    try {
      await ax.post(`${API}cart/add-to-cart/`, {product_id: id, quantity: quantity});
      console.log('Item updated:', id);
      reloadCart();
    } catch (error) {
      console.error(error);
    }
  };

  const cartValues = {
    cart,
    setCart,
    getProductQuantity,
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
