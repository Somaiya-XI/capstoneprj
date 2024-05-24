import React from "react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "@/backend";
// import { BasicNav } from "@/Components/BasicComponents/Nav";
import { Card, CardBody, Image, Spacer } from "@nextui-org/react";

const ProductDetail2 = () => {
  const [ProductData, setProductData] = useState([]);
  const { id } = useParams();

  const loadDetails = async () => {
    const { data } = await axios.get(
      `${API}product/catalog-product/get-product/${id}/`
    );
    setProductData(data);
  };

  useEffect(() => {
    loadDetails();
  }, []);

  return (
    <>
      {/* <BasicNav /> */}
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

export default ProductDetail2;
