import React from 'react';
import "./Supplier.css";
import SuccessMsg from './SuccessMsg';
import {
  Button,
  Cascader,
  TimePicker,
  DatePicker,
  Form,
  message,
  
} from 'antd';

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 6,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 14,
    },
  },
};
const SetSupply = () => (

  <Form
    {...formItemLayout}
    variant="filled"
    style={{
      maxWidth: 500,
      padding:60,
      
      
    }}
  >


    <Form.Item
      label="Date"
      name="DatePicker"
      rules={[
        {
          required: true,
          message: 'Please Select Date!',
        },
      ]}
    >
      <DatePicker />
    </Form.Item>

    <Form.Item
      label="Time"
      name="TimePicker"
      rules={[
        {
          required: true,
          message: 'Please Select Time!',
        },
      ]}
    >
      <TimePicker />
    </Form.Item>

    <Form.Item
      label="Product"
      name="Cascader"
      rules={[
        {
          required: false,
          message: 'Optional',
        },
      ]}
    >
      <Cascader/>
    </Form.Item>
    <Form.Item
      wrapperCol={{
        offset: 6,
        span: 16,
      }}
    >
        

        
      <Button type="Primary" className="AddButton2" htmlType="submit">
        Submit
      </Button>
      
    </Form.Item>

  </Form>
);
export default SetSupply;