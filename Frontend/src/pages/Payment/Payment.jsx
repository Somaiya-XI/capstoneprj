import React, { useState, useEffect } from "react";
import Header from "../Home/Components/Header/Header";
import Navbar from "../Home/Components/Navbar/Navbar";
import "./Payment.css";
import axios from "axios";
import visa from "./Images/visa.png";
import src from '../HardwareSet/page_assets/bg.json';
import { API } from "../../backend";

import { useCartContext, useUserContext } from "../../Contexts";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Button,
  Radio,
  RadioGroup,
  VisuallyHidden, cn,
  Breadcrumbs,
  BreadcrumbItem
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { CiShoppingCart } from "react-icons/ci";
import { IoBagCheckOutline } from "react-icons/io5";
import Shipment from "../Cart/Shipment";
import { Divider } from "antd";
import CartItem from "../Cart/CartItem";


const ProductDisplay = () => {
  const message = "Your payment is done successfully";
  const [isAccordtion, setIsActive] = useState(false);
  const { user } = useUserContext();
  const { cart } = useCartContext();
  const [balance, setBalance] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [selected, setSelected] = useState("");
  const navigate = useNavigate();
  const size = ["lg"];
  const id = 17;


  const loadWalletBalance = async () => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}payment/view-wallet-balance/${id}/`
    );
    console.log("Bassant!", data);

    setBalance(data.payment_wallet);
  };



  const PayByWallet = async () => {
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}payment/pay-by-wallet/`,
        {
          retailer: id,
          shipping_address: "JJ",
        }
      );

      // Step 1: Log the received data
      console.log("Step 1 - Response Data:", data);

      // Step 2: Update success state
      setSuccess(data.success);
      console.log("Step 2 - Success State Updated:", data.success);

      if (data.success === true) {
        // Step 3: Update balance if payment was successful
        setBalance(data.payment_wallet);
        console.log("Step 3 - Balance Updated:", data.payment_wallet);

        // Step 4: Display success toast
        toast.success("Success");
        console.log("Step 4 - Success Toast Displayed");

        // Additional Step: Log the conducted amount
        console.log("Conducted Amount:", data.conducted_amount);
      } else {
        // Step 5: Handle error if payment was unsuccessful
        setError(data.error);
        console.log("Step 5 - Error Set:", data.error);
      }
    } catch (error) {
      // Step 6: Catch and log any errors that occur during the process
      console.error("Error:", error);
    }
  };
  const PlaceOrder = async () => {
    if (selected) {
      console.log("Order placed successfully!");
    } else {
      console.log("Please select a payment method before placing the order.");
    }
  }

  const ChargeWallet = async () => {
    const { data } = await axios.put(
      `${import.meta.env.VITE_API_URL}payment/charge-wallet/`,
      {
        retailer: id,
        amount: 1000,
      }
    );
    console.log(data);
    setBalance(data.payment_wallet);
  };

  useEffect(() => {
    loadWalletBalance();
  }, []);

  return (
    <div className="c">
      <Header />
      <div id="c" className="md:container md:mx-auto">
        <Navbar />
        {/* <h1 className="display-5 px-4 py-3 mt-5 mx-auto">
          {user.company_name}'s Order Confirmation
        </h1> */}

        <Breadcrumbs className="text-[25px] py-3 mt-5 mx-auto">
          <BreadcrumbItem onClick={() => navigate('/cart')} startContent={<CiShoppingCart />}>Cart</BreadcrumbItem>
          <BreadcrumbItem startContent={<IoBagCheckOutline className='text-[#a3e189]' />}>Checkout</BreadcrumbItem>
        </Breadcrumbs>

        <section className="flex justify-between">
          <div className='container-fluid '>
            <Shipment />

            <Card className="payment-container max-w-[600px] py-3 mx-4">
              <CardHeader className="justify-between">
                <div className="flex flex-col">
                  <h6 className="text-lg text-black">Payment Method</h6>
                  <p>Select your payment method</p>
                </div>
              </CardHeader>
              <CardBody className="bottom-5">
                <RadioGroup
                  color="default"
                  value={selected}
                  onValueChange={setSelected}

                >
                  <Radio value="wiser-wallet" classNames={{
                    base: cn(
                      "inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between",
                      "flex-row-reverse max-w-[300px] cursor-pointer rounded-lg gap-4 p-4 border-1",
                      "data-[selected=true]:border-[#a3e189]",
                      "rounded-[20px] max-w-[550px]"
                    ),
                  }}

                  >Wiser Wallet
                    <p className="font-th">
                      Not Sufficient Balance?{' '}
                      <span
                        style={{ textDecoration: 'underline', cursor: 'pointer', color: "#a3e189" }}
                        onClick={() => setIsActive(!isAccordtion)}
                      >
                        Charge Now
                      </span>
                    </p>
                  </Radio>
                  {isAccordtion && (
                    <Card className="shadow-none h-[300px]">
                      <Card className="mx-10 my-3 h-[150px] w-[475px] rounded-[20px]">
                        <CardHeader className="absolute z-10 top-1 flex-col !items-start">
                          <p className="text-tiny text-white/60 uppercase font-bold">{user.company_name}'s Wallet</p>
                          <h4 className="text-white font-medium text-large">Current Balance</h4>
                          <h2 className="text-white tracking-wide">${balance}</h2>
                        </CardHeader>
                        <img
                          removeWrapper
                          alt="Card background"
                          className="z-0 w-full h-full object-cover"
                          src="https://nextui.org/images/card-example-2.jpeg"
                        />
                      </Card>
                      <div className="flex justify-center">
                        <Button className='bg-[#023c07] text-default w-2/5' onClick={PayByWallet}>
                          Buy $
                        </Button>
                        <Button className='bg-white border-1 border-[#243c5a]-100 border-[#023c07] text-[#243c5a] w-2/5 mx-2' onClick={ChargeWallet}>Charge +</Button>
                      </div>
                    </Card>
                  )}
                  <Radio value="creadit-card" classNames={{
                    base: cn(
                      "inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between",
                      "flex-row-reverse max-w-[300px] cursor-pointer rounded-lg gap-4 p-4 border-1",
                      "data-[selected=true]:border-[#a3e189]",
                      "rounded-[20px] max-w-[550px]"
                    ),
                  }}>Credit Card</Radio>
                  <p className="text-default-500 text-small">Selected: {selected}</p>
                </RadioGroup>
              </CardBody>
            </Card>
          </div>
          {cart && cart.products?.length > 0 ? (
            <Card className="order-summary py-10 mx-4">
              <CardHeader className="flex gap-3">
                <div className="flex">
                  <p className="text-lg text-black font-medium">
                    {user.company_name}'s Order Summary
                  </p>
                </div>
              </CardHeader>
              <Divider className="m-2" />
              {cart.products.map((p, index) => (
                <>
                  <CardBody key={p.product_id}>
                    <div className="grid md:grid-cols-12 gap-6 md:gap-4 items-center justify-center px-3">
                      <div className="flex ">
                        <img
                          alt={p.name}
                          className="object-cover"
                          height={200}
                          shadow="md"
                          src={`http://localhost:8000${p.image}`}
                          width={100}
                        />
                      </div>
                      <div className="flex flex-col col-span-6 md:col-span-8">
                        <div className="flex justify-between items-start">
                          <div className="flex flex-col gap-0">
                            <h1 className="text-large font-medium">
                              {p.name}
                            </h1>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between">
                            <p className="text-small">SAR {Number(p.subtotal).toFixed(2)}</p>
                            <p className="text-small text-foreground/50">{p.quantity} quantity</p>
                          </div>
                        </div>

                      </div>
                    </div>
                  </CardBody>
                  {index !== cart.products.length - 1 && <Divider className="m-2" />}
                </>
              ))}
              <Divider />
              <div className="flex flex-col col-span-6 md:col-span-8 mx-3">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-0">
                    <p className="text-lg text-black font-medium">
                      Order Total
                    </p>
                    <p className="text-small">Shipping: FREE</p>
                    <p className="text-small">Subtotal: SAR {cart.total}</p>
                  </div>
                </div>
              </div>
              <CardFooter className="flex justify-center">
                <Button
                  className="bg-[#023c07] text-default w-2/5"
                  onClick={""}
                >
                  Place Order
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <div
              className="text-muted d-flex align-items-center justify-content-center w-100"
              style={{ marginTop: "200px", marginLeft: "auto" }}
            >
              <span className="display-6 d-flex align-items-center justify-content-center">
                Your Cart is empty
              </span>
            </div>
          )}


        </section>


      </div>
    </div>
  );
};

const Message = ({ message }) => (
  <section>
    <p>{message}</p>
  </section>
);

export default function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);

    if (query.get("session_id")) {
      //s_id = query.get("session_id")
      //setMessage("Order placed! You will receive an email confirmation.");
      const s = query.get("session_id")
      setMessage("s_id: " + s);
    }

    // if (query.get("canceled")) {
    //   setMessage(
    //     "Order canceled -- continue to shop around and checkout when you're ready."
    //   );
    // }
  }, []);

  return message ? <Message message={message} /> : <ProductDisplay />;
}


