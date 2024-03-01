import "./productcard.css";
import { AiOutlineShoppingCart } from "react-icons/ai";
const ProductCard = ({
  customClass,
  productImage,
  productName,
  seller,
  price,
  oldPrice,
}) => {
  return (
    <div id={customClass} className="col-lg-1-5 col-md-4 col-12 col-sm-6">
      <div
        className="product-cart-wrap mb-30 wow animate__ animate__fadeIn animated"
        data-wow-delay=".1s"
      >
        <div className="product-img-action-wrap">
          <div className="product-img product-img-zoom">
            <a href="#">
              <img className="default-img" src={productImage} alt="" />
            </a>
          </div>
          {oldPrice !== null ? (
            <div className="product-badges product-badges-position product-badges-mrg">
              <span className="hot">Hot</span>
            </div>
          ) : null}
        </div>
        <div className="product-content-wrap">
          <h2>
            <a href="#">{productName}</a>
          </h2>
          <div>
            <span className="font-small text-muted">
              Seller <a href="#">{seller}</a>
            </span>
          </div>
          <div className="product-card-bottom">
            <div className="product-price">
              <span className="old-price">
                <i>{oldPrice}</i>
              </span>
              <span>{price}</span>
            </div>
            <div className="add-cart">
              <a className="add" href="#">
                <AiOutlineShoppingCart /> Add{" "}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductCard;
