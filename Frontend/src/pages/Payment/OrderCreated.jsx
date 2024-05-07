import React, { useState } from 'react';
import { BasicNav } from '@/Components';
import Footer from '../Home/Components/Footer/Footer';
import { useEffect } from 'react';
import { API } from '@/backend';
import axios from 'axios';
import {useNavigate} from "react-router-dom";

const OrderCreated = () => {
    const [formData, setFormData] = useState({});
    const [showOrderDetails, setShowOrderDetails] = useState(true);

    const toggleOrderDetails = () => {
        setShowOrderDetails(!showOrderDetails);
    };

    const OrderSummary = async () => {
        try {
            const response = await axios.get(`${API}order/d5aaf539-6860-4a2e-a68b-384cdd7ee40d/`, {
                withCredentials: true,
            });
            console.log("Fetched data:", response.data);
            setFormData(response.data);
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
            <div className="flex items-center justify-center h-screen">
                <div className="flex flex-col items-center justify-center text-center font-bold text-4xl">
                    {showOrderDetails && (
                        <Iconify-icon
                            className='inline'
                            icon='line-md:circle-to-confirm-circle-twotone-transition'
                            width='100'
                            height='100'
                            begin='0.8s'
                            dur='1000'
                            style={{ color: '#008040' }}
                        />
                    )}
                    {showOrderDetails ? (
                        <h1 className="text-3xl mt-4">Order has been created Successfully!</h1>
                    ) : (
                        <div>
                            {formData && (
                                <div className="text-left text-4xl mt-4">
                                <p>Order ID: {formData.order_id}</p>
                                <p>Order Date: {formData.order_date}</p>
                                <p>Payment Method: {formData.payment_method}</p>
                                <p>Total Price: {formData.total_price}</p>
                                <p>Shipping Address: {formData.shipping_address}</p>
                              </div>
                              
                            )}
                        </div>
                    )}
                    <div className="mt-4">
                        {showOrderDetails ? (
                            <p className="underline cursor-pointer" onClick={toggleOrderDetails}>VIEW ORDER DETAILS</p>
                        ) : null}
                        {/* Add additional content here */}
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}

export default OrderCreated;
