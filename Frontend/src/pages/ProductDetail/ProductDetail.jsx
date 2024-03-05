import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const ProductDetail = () => {
  const [ProductData, setProductData] = useState([]);
  const [SupplierData, setSupplierData] = useState([]);
  const { id } = useParams();

  const loadDetails = async () => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}product/catalog-product/${id}/`
    );
    console.log(data);
    setProductData(data);
    setSupplierData(data.supplier);
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
      <h4>Supplier: {SupplierData.company_name}</h4>
      <h4>Price: {ProductData.new_price}</h4>
      <h4>Minimum Order Quantity: {ProductData.min_order_quantity}</h4>
      <h4>Expiry Date: {ProductData.expiry_date}</h4>
      <h4>Production Date: {ProductData.production_date}</h4>
    </div>
  );
};

export default ProductDetail;
