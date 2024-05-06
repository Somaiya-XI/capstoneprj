import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "@/backend";


const ProductDetail = () => {
  const [ProductData, setProductData] = useState([]);
  const { id } = useParams();

  const loadDetails = async () => {
    const { data } = await axios.get(
      `${API}product/catalog-product/get-product/${id}/`
    );
    console.log(data);
    setProductData(data);
  };

  useEffect(() => {
    loadDetails();
  }, []);

  return (
    <div>
      <h1>Product Details</h1>
      <img src={ProductData.product_img} />
      <h4>Product Name: {ProductData.product_name}</h4>
      <h4>Category: {ProductData.category}</h4>
      <h4>Brand: {ProductData.brand}</h4>
      <h4>Supplier: {ProductData.company_name}</h4>
      <h4>Price: {ProductData.new_price}</h4>
      <h4>Minimum Order Quantity: {ProductData.min_order_quantity}</h4>
      {/* <h4>Expiry Date: {ProductData.expiry_date}</h4>
      <h4>Production Date: {ProductData.production_date}</h4> */}
    </div>
  );
};

export default ProductDetail;
