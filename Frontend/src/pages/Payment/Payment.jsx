import React, { useState, useEffect } from "react";
import Header from "../Home/Components/Header/Header";
import Navbar from "../Home/Components/Navbar/Navbar";

import "./Payment.css";
import axios from "axios";
import CustomErrorAlert from "@/Components/FormComponents/CustomAlerts";
import { CustomErrorToast } from "@/Components";

import { useCartContext, useCsrfContext, useUserContext } from "../../Contexts";
import { CustomSuccessToast } from "@/Components/FormComponents/CustomAlerts";
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
  BreadcrumbItem,
  Avatar
} from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";
import { CiShoppingCart } from "react-icons/ci";
import { IoBagCheckOutline } from "react-icons/io5";
import Shipment from "../Cart/Shipment";
import { Divider } from "antd";
import CartItem from "../Cart/CartItem";
import { API, imgURL } from "@/backend";





const ProductDisplay = () => {
  const [address, setAddress] = useState([]);
  const [Newaddress, setNewAddress] = useState("");
  const navigate = useNavigate();
  const message = "Your payment is done successfully";
  const [isAccordtion, setIsActive] = useState(false);
  const {orderId, setOrderId } = useCartContext()
  const { user } = useUserContext();
  const { cart } = useCartContext();
  const [balance, setBalance] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [selected, setSelected] = useState("");
  const size = ["lg"];


  const user_id = user.id;
  const {ax} = useCsrfContext();
  const loadWalletBalance = async () => {
    const { data } = await axios.get(
      `${API}payment/view-wallet-balance/`,
        user_id
      
    );
    setBalance(data.payment_wallet);
  };


  const fetchAddresses = async () => {
    axios.get(`${API}user/${user.id}`, {
      withCredentials: true,
    })
      .then(response => {
        const addressString = response.data.address;
        console.log("hi check this", addressString)
        setNewAddress(addressString);
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const PayByCreditCard = async () => {
    try {
      const requestData = {
        user_id: user.id,
        shipping_address: Newaddress,
        order_type: "BASIC"
      };
      const form = document.createElement('form');
      form.setAttribute('method', 'POST');
      form.setAttribute('action', `${import.meta.env.VITE_API_URL}order/create-checkout-session/`);
      Object.keys(requestData).forEach(key => {
        const input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', key);
        input.setAttribute('value', requestData[key]);
        form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  const PayByWallet = async () => {
    try {
      const requestData = {
        shipping_address: Newaddress,
        order_type: "BASIC"
      };
      console.log(requestData);
  
      const { data } = await ax.put(
        `${API}payment/pay-by-wallet/`,
         {shipping_address: Newaddress, order_type: "BASIC",},
      );
      console.log("HELLO!", data.success)
      
      // const order_id = data
      
      if (data.success === true) {
        
        setBalance(data.payment_wallet);
        setOrderId(data.order_id)
        console.log("hama?", orderId)
        CustomSuccessToast({msg:"Successful payment!, redirecting .. "});
        navigate('/order-created');

         
      } else {
        setError(data.error);
        CustomErrorToast({ msg: 'Please recharge your wallet', duration: 1500 });
      }
    } catch (error) {
      CustomErrorToast({ msg: 'Something went wrong! please try again', duration: 1500 });
    }
  };

  
  const PlaceOrder = () => {
    if (address.length === 0) {
      CustomErrorToast({ msg: 'Shipping Address must be added', duration: 1500 });
      return;
    }
  
    const isValid = address.every(addr => {
      const valid = addr.state && addr.city && addr.district && addr.street;
      if (!valid) {
        CustomErrorToast({ msg: 'All shipping Address fields must be added', duration: 1500 });
      }
      return valid;
    });
  
    if (isValid) {
      if (selected === "credit-card") {
        PayByCreditCard();
      } else if (selected === "wiser-wallet") {
        PayByWallet();
      } else {
        CustomErrorToast({ msg: 'Choose payment method!', duration: 3000 });
      }
    }
  
    return isValid;
  };
  
  const ChargeWallet = async () => {
    const { data } = await axios.put(
      `${import.meta.env.VITE_API_URL}payment/charge-wallet/`,
      {
        user_id,
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
        {/* <form
            action={`${
              import.meta.env.VITE_API_URL
            }cart/create-checkout-session/`}
            method="POST"
          >
            <Button type="submit">Pay By Credit Card</Button>
          </form>  */}

        <section className="flex justify-between">
          <div className='container-fluid '>
            <Shipment address={address} setAddress={setAddress} />
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
                        {/* <Button className='bg-[#023c07] text-default w-2/5' onClick={PayByWallet}>
                          Buy $
                        </Button> */}
                        <Button className='bg-white border-1 border-[#243c5a]-100 border-[#023c07] text-[#243c5a] w-2/5 mx-2' onClick={ChargeWallet}>Charge +</Button>
                      </div>
                    </Card>
                  )}
                  <Radio value="credit-card" classNames={{
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
            <Card className="order-summary py-10 mx-4 border-1 bg-white">
              <CardHeader className="flex gap-3">
                <div className="flex">
                  <p className="text-lg text-black font-medium text-[#7E7E7E]">
                    {user.company_name}'s Order Summary
                  </p>
                </div>
              </CardHeader>
              <Divider className="m-2" />
              {cart.products.map((p, index) => (
                <>
                  <CardBody key={p.product_id}>
                    <div className="grid md:grid-cols-12 gap-10 md:gap-4 items-center justify-center px-3">
                      <div className="flex ">
                        <img
                          alt={p.name}
                          className="max-w-[57px] "
                          height={200}
                          shadow="md"
                          src={`${imgURL}${p.image}`}
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
                  onClick={PlaceOrder}
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

