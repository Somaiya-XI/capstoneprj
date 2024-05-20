import React, { useState, useEffect } from 'react';
import { BasicNav } from '@/Components';
import Footer from '../Home/Components/Footer/Footer';
import { API } from '@/backend';
import { useParams } from 'react-router-dom';
import { useCartContext } from '@/Contexts';
import { useCsrfContext } from '@/Contexts';
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Button,
    Divider,
} from "@nextui-org/react";
import { imgURL } from '@/backend';

const OrderCreated = () => {
    const [orderDetails, setOrderDetails] = useState([]);
    const [orderData, setOrderData] = useState(null);
    const { orderId, setOrderId } = useCartContext();
    const [ViewOrderDetails, setViewOrderDetails] = useState(false); // Default to false to hide initially
    const { ax } = useCsrfContext();
    const { id } = useParams();

    const toggleOrderDetails = () => {
        setViewOrderDetails(!ViewOrderDetails);
    };

    const OrderSummary = async () => {
        try {
            const response = await ax.get(`${API}order/view-order-summary/${id}/`, {
                withCredentials: true,
            });
            console.log("Fetched data:", response.data);

            // Extracting order_data and ordered_items from the response
            if (response.data && response.data.ordered_items) {
                setOrderDetails(response.data.ordered_items);
                setOrderData(response.data.order_data);
            } else {
                console.error("Expected order data structure not found:", response.data);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        OrderSummary();
    }, []);

    return (
        <>
            <BasicNav />
            <div className="flex items-center justify-center min-h-screen bg-white-100">
                <div className="w-full max-w-3xl p-4">
                    <div className="flex flex-col items-center justify-center text-center font-bold text-4xl">
                        {!ViewOrderDetails && (
                            <>
                                <iconify-icon
                                    className='inline'
                                    icon='line-md:circle-to-confirm-circle-twotone-transition'
                                    width='100'
                                    height='100'
                                    begin='0.8s'
                                    dur='1000'
                                    style={{ color: '#008040' }}
                                />
                                <h1 className="text-3xl mt-4">Order has been created Successfully!</h1>
                            </>
                        )}
                        {ViewOrderDetails && (
                            <Card className="order-summary py-10 mx-4 border-1 bg-white w-full">
                                <CardHeader className="flex gap-3">
                                    <div className="flex">
                                        <p className="text-lg text-black font-medium text-[#7E7E7E]">
                                            Order Summary
                                        </p>
                                    </div>
                                </CardHeader>
                                <Divider className="m-2" />
                                <CardBody>
                                    {orderData && (
                                        <div className="mb-4 text-lg text-black font-medium ">
                                            <p>Order ID: {orderData.order_id}</p>
                                            {/* <p>Retailer: {orderData.retailer}</p> */}
                                            <p>Order Date: {orderData.order_date}</p>
                                            <p>Payment Method: {orderData.payment_method}</p>
                                            <p>Total Price: {orderData.total_price}</p>
                                            <p>Shipping Address: {orderData.shipping_address}</p>
                                            {/* <p>Payment Session ID: {orderData.payment_session_id}</p> */}
                                        </div>
                                        
                                    )}

                                    <Divider className="mb-4" />
                                    <h2 className="mb-4 text-lg font-medium text-[#023c07] ">Orderd Products</h2>
                                    <Divider className="m-2" />
                                    {orderDetails.map((item, index) => (
                                        <div key={index}>
                                            <div className="grid md:grid-cols-12 gap-10 md:gap-4 items-center justify-center ">
                                                
                                                <div className="flex flex-col col-span-6 md:col-span-8">
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex flex-col gap-0">
                                                            <h1 className="text-large font-medium">
                                                                {item.product_id.product_name}
                                                            </h1>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex justify-between">
                                                            <p className="text-small">
                                                                SAR {Number(item.product_id.new_price).toFixed(2)}
                                                            </p>
                                                            <p className="text-small text-foreground/50">
                                                                {item.ordered_quantity} quantity
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {index !== orderDetails.length - 1 && <Divider className="m-2" />}
                                        </div>
                                    ))}
                                </CardBody>
                                <Divider />
                                <CardFooter className="flex justify-center">
                                    <Button
                                        className="bg-[#023c07] text-default w-1/5"
                                        onClick={toggleOrderDetails}
                                    >
                                        {ViewOrderDetails ? 'HIDE ORDER DETAILS' : 'VIEW ORDER DETAILS'}
                                    </Button>
                                </CardFooter>
                            </Card>
                        )}
                        {!ViewOrderDetails && (
                            <div className="mt-4">
                                <p className="underline cursor-pointer" onClick={toggleOrderDetails}>
                                    VIEW ORDER DETAILS
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default OrderCreated;
