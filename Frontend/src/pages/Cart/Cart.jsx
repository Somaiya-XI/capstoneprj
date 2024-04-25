import {Children, useEffect, useState} from 'react';
import './Cart.css';
import {useNavigate} from 'react-router-dom';
import {LiaTrashAltSolid as TrashIcon} from 'react-icons/lia';
import {useCartContext, useCsrfContext, useUserContext} from '../../Contexts';
import {API} from '../../backend';
import {Link} from 'react-router-dom';
import ListHeader from './ListHeader';
import CartItem from './CartItem';
import BinIcon from './BinIcon';
import Checkout from './Shipment';
import {RiEmotionSadLine} from 'react-icons/ri';
import {toast} from 'sonner';
import {Button} from '@nextui-org/react';
import {SearchNav} from '@/Components';

const Cart = () => {
  const text = ['Product', 'Unit Price', 'Quantity', 'Subtotal', 'Remove'];
  const flex = [3];

  const {user} = useUserContext();
  const {ax} = useCsrfContext();
  const {cart, UpdateCartContent, fetchCart, loading} = useCartContext();
  const [showSection, setShowSection] = useState(false);
  const navigate = useNavigate();

  const reloadCart = () => {
    fetchCart();
  };

  const removeFromCart = async (id) => {
    if (cart) {
      try {
        const response = await ax.post(`${API}cart/remove-from-cart/`, {product_id: id});
        console.log('Item removed:', id);
        reloadCart();
        console.log('response: ', response);
        return response;
      } catch (error) {
        console.error(error.message);
      }
    } else {
      toast.error('cannot perform this action, try again', {duration: 1500});
    }
  };

  const clearCart = async () => {
    if (cart) {
      try {
        await ax.post(`${API}cart/clear-cart/`, {});
        console.log('Cart cleared');
        reloadCart();
      } catch (error) {
        console.error(error.message);
      }
    } else {
      toast.warning('your cart is empty', {duration: 1500});
    }
  };

  const displayCheckout = () => {
    setShowSection((prevState) => !prevState);
  };

  return (
    <>
      <SearchNav />

      <section className='mt-5 mb-5'>
        <div className='container-fluid m-5'>
          <div className='row'>
            <div className='col-lg-8 mb-4'>
              <h1 className='display-5 fw-normal mb-4 ml-4'>{user.company_name}'s Cart</h1>
              <div className='d-flex justify-content-between'>
                <h5 className='ml-4'>Carefully check the information before checkout</h5>
                <h5>
                  <Link onClick={clearCart} className='text-muted d-flex align-items-center'>
                    <span className='mr-1'>Clear Cart</span> <BinIcon height='1.5rem' width='1.5rem' className='mr-4' />
                  </Link>
                </h5>
              </div>
            </div>
          </div>
          <div className='col-lg-8'>
            <div className='cart-items'>
              <ListHeader text={text} flexStyles={flex} /> <br />
              {loading ? (
                <h4 className='m-4'>Loading cart...</h4>
              ) : (
                <>
                  {cart && cart.products?.length > 0 ? (
                    cart.products.map((p) => (
                      <CartItem
                        key={p.product_id}
                        id={p.product_id}
                        image={p.image}
                        product_name={p.name}
                        unit_price={p.unit_price}
                        subtotal={p.subtotal}
                        quantity={p.quantity}
                        min_qyt={p.min_qyt}
                        stock={p.stock}
                        remove={removeFromCart}
                        add={UpdateCartContent}
                      />
                    ))
                  ) : (
                    <div
                      className='text-muted d-flex align-items-center justify-content-center w-100'
                      style={{marginTop: '200px', marginLeft: 'auto'}}
                    >
                      <span className='display-6 d-flex align-items-center justify-content-center'>
                        Your Cart is empty
                      </span>
                      <RiEmotionSadLine className='ml-2 d-flex align-items-center justify-content-center' size={40} />
                    </div>
                  )}
                </>
              )}
            </div>
            <div className='container-fluid mt-4'>
              {cart?.products && (
                <h5 className='text-muted' style={{textAlign: 'end'}}>
                  Total: {cart.total}
                </h5>
              )}
            </div>
            {cart?.products && (
                <Button className='bg-[#023c07] text-white' onClick={() => navigate('/payment')}>
                Checkout
              </Button>
              )}
            
          </div>
        </div>
      </section>

      
    </>
  );
};

export default Cart;
