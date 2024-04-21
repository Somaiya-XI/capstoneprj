import React, { useState, useEffect } from "react";
import Header from "../Home/Components/Header/Header";
import Navbar from "../Home/Components/Navbar/Navbar";
import "./Payment.css";
import axios from "axios";
import Payby from "./Payby";
import { Payby2 } from "./Payby";
import visa from "./Images/visa.png";
import { useCartContext, useUserContext } from "../../Contexts";
import { toast } from "sonner";
import { Button, ButtonGroup } from "@nextui-org/react";

const ProductDisplay = () => {
  const message = "Your payment is done successfully";
  const { user } = useUserContext();
  const [balance, setBalance] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const {cart} = useCartContext();
  const id = 17;
  

  const loadWalletBalance = async () => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}payment/view-wallet-balance/${id}/`
    );
    console.log(data);
    setBalance(data.payment_wallet);
  };

  const PayByWallet = async () => {
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}payment/pay-by-wallet/`,
        { retailer: id,
          shipping_address: "JJ",
         }
      );
  
      setSuccess(data.success);
  
      if (data.success === true) {
        const deductBalance = data.payment_wallet - cart.total;
        setBalance(deductBalance);
  
        if (cart.total > data.payment_wallet) {
          toast.error("Insufficient transaction. Please recharge the wallet!", { duration: 2500 });
        } else {
          toast.success("Transaction is successful!", { duration: 2500 });
        }
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.error('Error occurred while processing payment:', error);
      setError('An error occurred while processing payment. Please try again later.');
    }
  };
  

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
    <div id="c">
      <Header />
      <div id="c" className="md:container md:mx-auto">
        <Navbar />
        <h1 className="display-5 fw-normal mb-4 ml-4">
          {user.company_name}'s Order Checkout
        </h1>
        <section>
          <Payby>
            <h2>Balance: {balance} $</h2>
            {/* {success === true ? (
              toast.info(message, {duration: 2500})
            ) : (
              toast.error("cannot perform this action, try again", { duration: 2500 })
            )} */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                type="submit"
                className="bg-[#023c07] text-white"
                onClick={PayByWallet}
              >
                Pay By Wallet
              </Button>
              <Button
                type="submit"
                className="bg-[#023c07] text-white"
                onClick={ChargeWallet}
              >
                Charge The Wallet
              </Button>
            </div>

            {/* <form
            action={`${
              import.meta.env.VITE_API_URL
            }cart/create-checkout-session/`}
            method="POST"
          >
            <button type="submit">Pay By Credit Card</button>
          </form> */}
          </Payby>
        </section>
        <br />
        <section>
          <Payby2>
            <form
              action={`${
                import.meta.env.VITE_API_URL
              }cart/create-checkout-session/`}
              method="POST"
            >
              <img type="submit" alt="Card background" src={visa} width={270} />
            </form>
          </Payby2>
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

    if (query.get("session_id")){
      //s_id = query.get("session_id")
      //setMessage("Order placed! You will receive an email confirmation.");
      const s = query.get("session_id")
      setMessage("s_id: "+s);
    }

    // if (query.get("canceled")) {
    //   setMessage(
    //     "Order canceled -- continue to shop around and checkout when you're ready."
    //   );
    // }
  }, []);

  return message ? <Message message={message} /> : <ProductDisplay />;
}
