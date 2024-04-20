import './productcard.css';
import {AiOutlineShoppingCart} from 'react-icons/ai';
import {Link} from 'react-router-dom';
import {CartButton} from '../../../../../Components';
const ProductCard = ({customClass, productID, productImage, productName, seller, price, oldPrice, discount}) => {
  return (
    <div id={customClass} className='col-lg-1-5 col-md-4 col-12 col-sm-6'>
      <div className='product-cart-wrap mb-30 wow animate__ animate__fadeIn animated' data-wow-delay='.1s'>
        <div className='product-img-action-wrap'>
          <div className='product-img product-img-zoom'>
            <Link to={`/product/${productID}`}>
              <img className='default-img' src={productImage} alt='' />
            </Link>
          </div>
          {discount !== '0.00' ? (
            <div className='product-badges product-badges-position product-badges-mrg'>
              <span className='hot'>{discount + '%'}</span>
            </div>
          ) : null}
        </div>
        <div className='product-content-wrap'>
          <h2>
            <Link to={`/${productID}`}>{productName}</Link>
          </h2>
          <div>
            <span className='font-small text-muted'>
              Seller <Link to={`/${productID}`}>{seller.company_name}</Link>
            </span>
          </div>
          <div className='product-card-bottom'>
            <div className='product-price'>
              {discount !== '0.00' ? (
                <span className='old-price'>
                  <i>{'$' + oldPrice}</i>
                </span>
              ) : null}
              <span>{'$' + price}</span>
            </div>
            <CartButton id={productID} />
            {/* <div className="add-cart">
              <a className="add" href="#">
                <AiOutlineShoppingCart /> Add{" "}
              </a>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductCard;
