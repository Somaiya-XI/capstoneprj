import {useContext, useEffect, useState} from 'react';
import './Cart.css';
import {LiaTrashAltSolid as TrashIcon} from 'react-icons/lia';
import {UserContext} from '../../Contexts';
import {API} from '../../backend';
import axios from 'axios';
import {Link} from 'react-router-dom';

const Cart = () => {
  const {user} = useContext(UserContext);

  const [cart, setCart] = useState(null);

  const fetchCart = async () => {
    try {
      const response = await axios.get(`${API}cart/view-cart/`, {
        withCredentials: true,
      });
      const {data} = response;
      setCart(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <>
      <section className='mt-5 mb-5'>
        <div className='container-fluid m-5'>
          <div className='row'>
            <div className='col-lg-8 mb-4'>
              <h1 className='display-5 fw-normal mb-4'>{user.company_name}'s Cart</h1>
              <div className='d-flex justify-content-between'>
                <h5>Carefully check the information before checkout</h5>
                <h5>
                  <Link to='#' className='text-muted d-flex align-items-center'>
                    <span>Clear Cart</span> <TrashIcon className='mr-1' />
                  </Link>
                </h5>
              </div>
            </div>
          </div>
          <div className='row d-flex '>
            <div className='col-lg-8'>
              <div className='table-responsive'>
                {cart ? (
                  <table className='table'>
                    <thead>
                      <tr className='main-heading h4'>
                        <th className='custome-checkbox start pl-3' colSpan='2'>
                          Product
                        </th>
                        <th scope='col'>Unit Price</th>
                        <th scope='col'>Quantity</th>
                        <th scope='col'>Subtotal</th>
                        <th scope='col' className='end'>
                          Remove
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.products.map((product) => (
                        <tr key={product.product_id}>
                          <td className='wrapper'>
                            <div className='container d-flex justify-content-center align-items-center'>
                              {product.image && <img src={`${API}${product.image}`} alt={product.name} width='70px' />}
                            </div>
                          </td>
                          <td className='product-des product-name'>
                            <h5 className='product-name'>
                              <Link to={`/${product.product_id}`}>{product.name}</Link>
                            </h5>
                          </td>
                          <td className='h5'>{product.unit_price}</td>
                          <td className='h5 '>
                            <input type='number' value={product.quantity} min='1' lang='en' />
                          </td>
                          <td className='h5'>{product.subtotal}</td>
                          <td className='h5'>
                            <button>
                              <TrashIcon size={30} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td>
                          <h4>Total:</h4>
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>
                          <h4>{cart.total}</h4>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                ) : (
                  <p>Loading cart...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Cart;
