import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Button,
} from "@nextui-org/react";
import { API } from "@/backend";
import { useCsrfContext } from "@/Contexts";
import { CustomSuccessToast, CustomErrorToast } from "@/Components";

const AutoOrderConfigView = ({product_id}) => {
  const {ax} = useCsrfContext();
  const [ConfigData, setConfigData] = useState({
    quantity_reach_level: '',
    ordering_amount: '',
  });

  const loadConfig = async () => {
    try {
      const { data } = await ax.get(
        `${API}config/auto-order-config/view-product-config/${product_id}/`,
        {}
      );
      if (data.hasOwnProperty("error")) {
        CustomErrorToast({ msg: data.error, dur: 3000 });
      } else {
        setConfigData({
          ...ConfigData,
          quantity_reach_level: data.quantity_reach_level,
          ordering_amount: data.ordering_amount,
        });
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleChange = (name) => (event) => {
    setConfigData({
      ...ConfigData,
      [name]: event.target.value,
    });
  };

  const updateConfig = async () => {
    try {
      const { data } = await ax.put(
        `${API}config/auto-order-config/update-product-config/`,
        {
          product_id: product_id,
          config_type: "special",
          quantity_reach_level: ConfigData.quantity_reach_level,
          ordering_amount: ConfigData.ordering_amount,
        }
      );
      if (data.hasOwnProperty("message")) {
        CustomSuccessToast({ msg: data.message, dur: 3000 });
        setConfigData({
          ...ConfigData,
          quantity_reach_level: data.data.quantity_reach_level,
          ordering_amount: data.data.ordering_amount,
        });
      } else if (data.hasOwnProperty("error")) {
        const error_length = Object.keys(data.error).length;
        if (error_length > 0 && error_length < 3) {
          if (data.error.hasOwnProperty("qunt_reach_level"))
            CustomErrorToast({
              msg: 'quantity reach level: ' + data.error['qunt_reach_level'],
              dur: 3000,
            });
          else if (data.error.hasOwnProperty('ordering_amount'))
            CustomErrorToast({
              msg: "ordering amount: Ensure this value is greater than 0, and integer value.",
              dur: 3000,
            });
        } else {
          CustomErrorToast({msg: data.error, dur: 3000});
        }
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const deleteConfig = async () => {
    try {
      const { data } = await ax.delete(
        `${API}config/auto-order-config/delete-product-config/`,
        { data: { product_id: product_id } }
      );
      if (data.hasOwnProperty("message")) {
        CustomSuccessToast({ msg: data.message, dur: 3000 });
        setConfigData({
          ...ConfigData,
          quantity_reach_level: data.data.quantity_reach_level,
          ordering_amount: data.data.ordering_amount,
        });
      } else if (data.hasOwnProperty("error")) {
        CustomErrorToast({ msg: data.error, dur: 3000 });
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  return (
    <Card className='py-5 space-y-3'>
      <CardHeader className='pb-0 pt-2 px-4 flex-col items-start'>
        <h4 className='font-bold text-large'>Auto-order settings</h4>
        <p className='text-default-500'>
          Tweak your product Auto-order configuration: quantity reach levels, ordering amount, and whether confirmation
          is required or not.
        </p>
      </CardHeader>
      <CardBody className='overflow-visible py-2'>
        <div className='flex flex-col space-y-6'>
          <Input
            type='Number'
            label='Enter quantity reach level'
            className='w-full h-10'
            value={ConfigData.quantity_reach_level}
            onChange={handleChange('quantity_reach_level')}
          />
          <Input
            type='Number'
            label='Enter ordering amount'
            className='w-full h-10'
            value={ConfigData.ordering_amount}
            onChange={handleChange('ordering_amount')}
          />
          <div className="flex gap-3">
            <Button
              className="bg-[#023c07] text-default mt-4 size-24 h-10"
              onClick={updateConfig}
            >
              Save
            </Button>
            <Button className='bg-[#fff] border-1 text-black mt-4 size-24 h-10 shadow-sm' onClick={deleteConfig}>
              Delete
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default AutoOrderConfigView;
