import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Input, Button } from "@nextui-org/react";
import axios from "axios";
import { API } from "@/backend";
import { useUserContext } from "@/Contexts";
import { CustomSuccessToast, CustomErrorToast } from "@/Components";
import { useCsrfContext } from "@/Contexts";

export default function NotificationCard() {
    const { ax } = useCsrfContext();
    const { user } = useUserContext();
    const [inputData, setInputData] = useState({
        low_quantity_threshold: null,
        near_expiry_days: null,
    });
    const [formSubmitted, setFormSubmitted] = useState(false);

    
    const fetchNotification = async () => {
        axios.get(`${API}config/notification-config/view_default_notification_config/`, {
            data: { user_id: user.id }
        })
    };

    useEffect(() => {
        fetchNotification();
    }, []);

    const handleSubmit = async () => {
        try {
            if (!formSubmitted) {
                if (parseInt(inputData.low_quantity_threshold) <= 0 || parseInt(inputData.near_expiry_days) <= 0) {
                    CustomErrorToast({ msg: 'You should specify days starting from 1 !', dur: 3000 });
                    return;
                }
                const notificationData = { ...inputData, retailer: user.id };
                const response = await axios.post(
                    `${API}config/notification-config/add-default-notification-config/`,
                    notificationData
                );
                console.log(response.data);
                CustomSuccessToast({ msg: 'Default Notifications has been added!', dur: 3000 });
                setFormSubmitted(true);
            } else {
                CustomErrorToast({ msg: 'Edit the input fields first!', dur: 3000 });
            }
        } catch (err) {
            if (err.message === "You should specify days starting from 1") {
                CustomErrorToast({ msg: err.message, dur: 3000 });
            } else {
                CustomErrorToast({ msg: 'Already setting a notification configuration.', dur: 3000 });
                console.log(err.response.data);
            }
        }
    };


    const handleEdit = async () => {
        setFormSubmitted(false)
        const { data } = axios.delete(`${API}config/notification-config/delete-default-notification-config/`, {
            data: { user_id: user.id }
        })
        CustomSuccessToast({ msg: "Notification has deleted successfuly!", dur: 3000 });
    };







    const handleChange = (e, fieldName) => {
        setInputData({ ...inputData, [fieldName]: e.target.value });
    };

    const isInputDisabled = () => {
        return formSubmitted;
    };

    return (
        <Card className="py-5 space-y-3">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <h4 className="font-bold text-large">Notifications settings</h4>
                <p className="text-default-500">
                    Tweak your market Notifications: quantity reach levels, and countdown to expiry.
                </p>
            </CardHeader>
            <CardBody className="overflow-visible py-2">
                <div className="flex flex-col space-y-6">
                    <Input
                        type="Number"
                        label="Enter quantity reach level."
                        className="w-full h-11"
                        value={inputData.low_quantity_threshold}
                        onChange={(e) => handleChange(e, 'low_quantity_threshold')}
                        isDisabled={isInputDisabled('low_quantity_threshold')}
                    />
                    <Input
                        type="Number"
                        label="Enter days before expiry."
                        className="w-full h-10"
                        value={inputData.near_expiry_days}
                        onChange={(e) => handleChange(e, 'near_expiry_days')}
                        isDisabled={isInputDisabled('near_expiry_days')}
                    />
                    <div className="flex gap-3">
                        <Button className="bg-[#023c07] text-default mt-4 size-24 h-10" onClick={handleSubmit}>Save</Button>
                        <Button className="bg-[#fff] border-1 text-black mt-4 size-24 h-10 shadow-sm" onClick={handleEdit}>Delete</Button>
                    </div>

                </div>
            </CardBody>
        </Card>
    );
}
