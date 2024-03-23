import React, { useState, useEffect } from "react";
import Header from "../Home/Components/Header/Header";
import Navbar from "../Home/Components/Navbar/Navbar";
import "./Payment.css";
import axios from "axios";
import Payby from "./Payby";
import { Payby2 } from "./Payby";
import visa from "./Images/visa.png";
import { useUserContext } from "../../Contexts";
import { toast } from "sonner";
import { Button, ButtonGroup } from "@nextui-org/react";

const ProductDisplay = () => {
  const message = "Your payment is done successfully";
  const { user } = useUserContext();
  const [balance, setBalance] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const id = 17;
  

  const loadWalletBalance = async () => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}payment/view-wallet-balance/${id}/`
    );
    console.log(data);
    setBalance(data.payment_wallet);
  };

  const PayByWallet = async () => {
    const { data } = await axios.put(
      `${import.meta.env.VITE_API_URL}payment/pay-by-wallet/`,
      {
        retailer: id,
      }
    );
    console.log(data);
    setSuccess(data.success);
    if (data.success === true) {
      setBalance(data.payment_wallet);
    } else {
      setError(data.error);
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
            {success === true ? (
              toast.info(message, {duration: 2500})
            ) : (
              toast.error("cannot perform this action, try again", { duration: 2500 })
            )}
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

    if (query.get("success")) {
      setMessage("Order placed! You will receive an email confirmation.");
    }

    if (query.get("canceled")) {
      setMessage(
        "Order canceled -- continue to shop around and checkout when you're ready."
      );
    }
  }, []);

  return message ? <Message message={message} /> : <ProductDisplay />;
}
