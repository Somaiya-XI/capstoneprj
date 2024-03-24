import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";

export default function Checkout() {
  const states = [
    { label: "Almadinah Province", value: "Almadinah" },
    { label: "Jeddah Province", value: "Jeddah" },
    { label: "Makkah Province", value: "Makkah" },
  ];
  const cities = [
    { label: "Almadinah", value: "Almadinah" },
    { label: "Yanbu", value: "Yanbu" },
    { label: "AlOla", value: "AlOla" },
  ];
  const districts = [
    { label: "Hadouda", value: "Hadouda" },
    { label: "Umm As-Suyouf", value: "Umm As-Suyouf" },
    { label: "Sadd Al-Ghaba", value: "Sadd Al-Ghaba" },
  ];

  return (
    <Card className="py-4">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <p className="text-tiny uppercase font-bold">Shipping Details</p>
        <h4 className="font-bold text-large">Shipping Address</h4>
      </CardHeader>
      <CardBody className="overflow-visible py-2">
  <div className="container-fluid mt-10">
    <div className="flex w-full flex-wrap md:flex-nowrap gap-8">
      <Select label="Select a state" className="max-w-xs" isRequired>
        {states.map((state) => (
          <SelectItem key={state.value} value={state.value}>
            {state.label}
          </SelectItem>
        ))}
      </Select>
      <Select label="Select a city" className="max-w-xs" isRequired>
        {cities.map((city) => (
          <SelectItem key={city.value} value={city.value}>
            {city.label}
          </SelectItem>
        ))}
      </Select>
      <Select label="Select a district" className="max-w-xs" isRequired>
        {districts.map((district) => (
          <SelectItem key={district.value} value={district.value}>
            {district.label}
          </SelectItem>
        ))}
      </Select>
      <Input 
        label="Write your street"
        className='calc(50% - 1rem)'
        isRequired
      />
    </div>
  </div>
</CardBody>

    </Card>
  );
}
