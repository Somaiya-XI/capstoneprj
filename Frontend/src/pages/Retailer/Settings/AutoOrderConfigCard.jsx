import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Input, Button, Checkbox } from "@nextui-org/react";
import { API } from "@/backend";
import { useCsrfContext } from "@/Contexts";
import { CustomSuccessToast, CustomErrorToast } from "@/Components";

export default function AutoOrderConfigCard() {

    const {ax} = useCsrfContext();
    const [ConfigData, setConfigData] = useState({
        quantity_reach_level: null,
        ordering_amount: null,
    });
    const [confirmationStatus, setConfirmationStatus] = useState(false)

    const loadConfig = async () => {
    try {
        const { data } = await ax.get(`${API}config/auto-order-config/view-default-config/`, {});
        console.log('response: ', data);
        setConfigData({
            ...ConfigData,
            quantity_reach_level: data.quantity_reach_level,
            ordering_amount: data.ordering_amount,
          });
        setConfirmationStatus(data.confirmation_status)
      }
      catch (error) {
        console.error(error.message);
      }
    }

    const handleChange = (name) => (event) => {
        setConfigData({
            ...ConfigData,
            [name]: event.target.value,
          });
    }

    const updateConfig = async () => {
        try {
            const { data } = await ax.put(`${API}config/auto-order-config/update-default-config/`, {
                quantity_reach_level: ConfigData.quantity_reach_level, 
                ordering_amount: ConfigData.ordering_amount,
                confirmation_status: confirmationStatus,
            });
            console.log(data)
            setConfigData({
                ...ConfigData,
                "quantity_reach_level": data.data.quantity_reach_level,
                "ordering_amount": data.data.ordering_amount,
              });
              setConfirmationStatus(data.data.confirmation_status)
        }catch (error) {
        console.error(error.message);
      }
    }

    const deleteConfig = async () => {
        try {
            const { data } = await ax.delete(`${API}config/auto-order-config/delete-default-config/`, {});
            console.log(data)
            setConfigData({
                ...ConfigData,
                "quantity_reach_level": data.data.quantity_reach_level,
                "ordering_amount": data.data.ordering_amount,
              });
              setConfirmationStatus(data.data.confirmation_status)
        }catch (error) {
        console.error(error.message);
      }
    }

    const applyToAll = async () => {
        try {
            const { data } = await ax.put(`${API}config/auto-order-config/default-config/apply-to-all/`, {});
            console.log(data)
            CustomSuccessToast({ msg: data.message, dur: 3000 });
        }catch (error) {
        console.error(error.message);
      }
    }

    const deleteFromAll = async () => {
        try {
            const { data } = await ax.put(`${API}config/auto-order-config/default-config/delete-from-all/`, {});
            console.log(data)
            CustomSuccessToast({ msg: data.message, dur: 3000 });
        }catch (error) {
        console.error(error.message);
      }
    }

    useEffect(() => {
        loadConfig();
      }, []);

    return (
        <Card className="py-5 space-y-3">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <h4 className="font-bold text-large">Auto-order settings</h4>
                <p className="text-default-500">
                    Tweak your market Auto-order configuration: quantity reach levels, ordering amount, and whether confirmation is required or not.
                </p>
            </CardHeader>
            <CardBody className="overflow-visible py-2">
                <div className="flex flex-col space-y-6">
                    <Input
                        type="Number"
                        label="Enter quantity reach level"
                        className="w-full h-10"
                        value={ConfigData.quantity_reach_level}
                        onChange={handleChange('quantity_reach_level')}
                    />
                    <Input
                        type="Number"
                        label="Enter ordering amount"
                        className="w-full h-10"
                        value={ConfigData.ordering_amount}
                        onChange={handleChange('ordering_amount')}
                    />
                    <Checkbox color="success" isSelected={confirmationStatus} onValueChange={setConfirmationStatus}>
                        Confirmation required
                    </Checkbox>
                    <div className="flex gap-3">
                        <Button className="bg-[#023c07] text-default mt-4 size-24 h-10" 
                        onClick={updateConfig}
                        >Save</Button>
                        <Button className="bg-[#fff] border-1 text-black mt-4 size-24 h-10 shadow-sm" 
                        onClick={deleteConfig}
                        >Delete</Button>
                        <Button className="bg-[#023c07] text-default mt-4 ml-5 size-26 h-10" 
                        onClick={applyToAll}
                        >Apply to All Products</Button>
                        <Button className="bg-[#fff] border-1 text-black mt-4 size-26 h-10 shadow-sm" 
                        onClick={deleteFromAll}
                        >Delete From All Products</Button>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}