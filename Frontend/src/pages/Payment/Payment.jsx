import React, { useState, useEffect } from "react";
import "./Payment.css";
import axios from "axios";

const ProductDisplay = () => {
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
    <section>
      <h2>Payment Wallet Balance: {balance} $</h2>
      {success === true ? (
        <h2>Your payment is done successfully</h2>
      ) : (
        <h2> {error} </h2>
      )}
      <button type="submit" onClick={PayByWallet}>
        Pay By Wallet
      </button>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <button type="submit" onClick={ChargeWallet}>
        Charge The Wallet
      </button>
      <br />
      <br />
      <form
        action={`${import.meta.env.VITE_API_URL}cart/create-checkout-session/`}
        method="POST"
      >
        <button type="submit">Pay By Credit Card</button>
      </form>
    </section>
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
