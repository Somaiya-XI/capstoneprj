import "./productcard.css";
import { AiOutlineShoppingCart } from "react-icons/ai";
const ProductCard = ({
  customClass,
  productID,
  productImage,
  productName,
  seller,
  price,
  oldPrice,
  discount,
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
          {discount !== "0.00" ? (
            <div className="product-badges product-badges-position product-badges-mrg">
              <span className="hot">{discount + "%"}</span>
            </div>
          ) : null}
        </div>
        <div className="product-content-wrap">
          <h2>
            <a href="#">{productName}</a>
          </h2>
          <div>
            <span className="font-small text-muted">
              Seller <a href="#">{seller.company_name}</a>
            </span>
          </div>
          <div className="product-card-bottom">
            <div className="product-price">
              {discount !== "0.00" ? (
                <span className="old-price">
                  <i>{"$" + oldPrice}</i>
                </span>
              ) : null}
              <span>{"$" + price}</span>
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
