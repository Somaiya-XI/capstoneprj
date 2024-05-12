import React from "react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { API, imgURL } from "../../backend";
import { BasicNav } from "@/Components";
import { Card, CardBody, Image, Button, Spacer } from "@nextui-org/react";
import { CustomErrorToast } from "@/Components";

const ProductDetail = () => {
  const [ProductData, setProductData] = useState([]);
  const { id } = useParams();
  const [quantity, setQuantity] = useState("");

  const decreaseQuantity = () => {
    const newQuantity = quantity - 1;
    if (newQuantity >= ProductData.min_order_quantity) {
      setQuantity(newQuantity);
    }
    if (newQuantity < ProductData.min_order_quantity) {
      CustomErrorToast({
        msg: `You cannot add less than ${ProductData.min_order_quantity} of this product`,
        position: "top-right",
        shiftStart: "ms-0",
      });
    }
  };

  const increaseQuantity = () => {
    const newQuantity = quantity + 1;
    if (newQuantity <= ProductData.quantity) {
      setQuantity(newQuantity);
    }
    if (newQuantity > ProductData.quantity) {
      CustomErrorToast({
        msg: `Over the stock, you cannot add more than ${ProductData.quantity}`,
        position: "top-right",
        shiftStart: "ms-0",
      });
    }
  };

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    if (inputValue === "") {
      setQuantity("");
    } else {
      const newQuantity = parseInt(inputValue);
      if (
        !isNaN(newQuantity) &&
        newQuantity >= ProductData.min_order_quantity &&
        newQuantity <= ProductData.quantity
      ) {
        setQuantity(newQuantity);
      } else if (newQuantity > ProductData.quantity) {
        setQuantity(ProductData.quantity);
      } else {
        setQuantity(ProductData.min_order_quantity);
      }
    }
    console.log(quantity);
  };

  const loadDetails = async () => {
    const { data } = await axios.get(
      `${API}product/catalog-product/get-product/${id}/`
    );
    console.log(data);
    setProductData(data);
    setQuantity(data.min_order_quantity);
  };

  useEffect(() => {
    loadDetails();
  }, []);

  return (
    <>
      <BasicNav />
      <div className="mt-4 px-4">
        <Card
          isBlurred
          className="border-none bg-background/60 dark:bg-default-100/50 max-w-[1415px] ml-4 py-20 px-5"
          shadow="sm"
        >
          <CardBody>
            <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 items-center justify-center">
              <div className="relative col-span-6 md:col-span-5">
                <Image
                  className={
                    ProductData.product_img
                      ? "opacity-1 object-cover"
                      : "opacity-0 object-cover"
                  }
                  height={600}
                  shadow="md"
                  src={ProductData.product_img}
                  width="100%"
                />
              </div>

              <div className="flex flex-col col-span-6 md:col-span-6">
                <div className="flex justify-center items-start mb-4">
                  <div className="flex flex-col gap-0">
                    <h3 className="font-semibold text-foreground/90">
                      {ProductData.product_name}
                    </h3>
                  </div>
                </div>

                <div className="flex w-full items-center justify-center mb-5 ml-5 pl-5">
                  <Button
                    className="bg-[#023c07] text-white mt-4 size-14 h-10 ml-2"
                    onClick={decreaseQuantity}
                  >
                    -
                  </Button>
                  <input
                    className="size-12 h-10 mt-4"
                    style={{ paddingLeft: "15px" }}
                    type="number"
                    value={quantity}
                    onChange={handleInputChange}
                  />
                  <Button
                    className="bg-[#023c07] text-white mt-4 size-14 h-10 mr-2"
                    onClick={increaseQuantity}
                  >
                    +
                  </Button>
                </div>

                <div className="flex justify-center items-start">
                  <div className="flex flex-col gap-0">
                    <p className="text-small text-[#29a56c]">Category</p>
                    <h1 className="text-large font-medium mt-0">
                      {ProductData.category}
                    </h1>
                    <Spacer y={6} />
                    <p className="text-small text-[#29a56c]">Brand</p>
                    <h1 className="text-large font-medium mt-0">
                      {ProductData.brand}
                    </h1>
                    <Spacer y={6} />
                    <p className="text-small text-[#29a56c]">Supplier</p>
                    <h1 className="text-large font-medium mt-0">
                      {ProductData.company_name}
                    </h1>
                    <Spacer y={6} />

                    {ProductData.discount_percentage !== "0.00" ? (
                      <>
                        <p className="text-small text-[#29a56c]">
                          Price Before Discount
                        </p>
                        <h1
                          className="text-large font-medium mt-0"
                          style={{
                            textDecorationLine: "line-through",
                            fontStyle: "italic",
                          }}
                        >
                          {ProductData.price} $
                        </h1>
                        <Spacer y={6} />
                      </>
                    ) : null}

                    <p className="text-small text-[#29a56c]">Price</p>
                    <h1 className="text-large font-medium mt-0">
                      {ProductData.new_price} $
                    </h1>
                    <Spacer y={6} />
                    <p className="text-small text-[#29a56c]">
                      Minimum Order Quantity
                    </p>
                    <h1 className="text-large font-medium mt-0">
                      {ProductData.min_order_quantity}
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default ProductDetail;
