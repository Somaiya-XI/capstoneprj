import React from "react";
import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";



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

export function Payby2({ children }) {
    return (
      <Card className="py-4">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <p className="text-tiny uppercase font-bold">PAY BY VISA</p>
        </CardHeader>
        <CardBody className="overflow-visible py-2">
          {children}
        </CardBody>
      </Card>
    );
  }
