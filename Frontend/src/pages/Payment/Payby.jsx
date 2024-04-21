import React from "react";
import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";
import axios from "axios";



export default function Payby({ children }) {
  return (
    <Card className="py-4">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <p className="text-tiny uppercase font-bold">PAY BY WiseR</p>
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        {children}
      </CardBody>
    </Card>
  );
}

// const Pay = async () => {
//   const { data } = await axios.post(
//     `${import.meta.env.VITE_API_URL}order/create-checkout-session/`,
//     {
//       headers: {
//         "Access-Control-Allow-Origin": "*",
//       },
//       payment_method : "wallet",
//       shipping_address : "JK",
//     }
//   );
//   console.log(data);
// };

export function Payby2({ children }) {
    return (
      <Card className="py-4">
        <form action={`${import.meta.env.VITE_API_URL}order/create-checkout-session/`} method="POST">
          <input id="kk" type="text" name="shipping_address"/>
          <button type="submit">Checkout</button>
        </form>
         {/* <button type="button" onClick={Pay}> Confirm </button> */}
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <p className="text-tiny uppercase font-bold">PAY BY VISA</p>
        </CardHeader>
        <CardBody className="overflow-visible py-2">
          {children}
        </CardBody>
      </Card>
    );
  }
