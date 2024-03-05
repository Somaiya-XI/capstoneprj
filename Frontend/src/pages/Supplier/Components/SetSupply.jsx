import React from 'react';
import "./Supplier.css";
import {
  Button,
  Cascader,
  TimePicker,
  DatePicker,
  Form,
  message,
} from 'antd';
const success = () => {
    const [messageApi, contextHolder] = message.useMessage();
    messageApi.open({
      type: 'success',
      content: 'This is a success message',
    });
  };
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
      maxWidth: 1000,
      padding:80,
      
      
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
      wrapperCol={{
        offset: 6,
        span: 16,
      }}
    >
        
      <Button type="Primary" className="AddButton" htmlType="submit" onClick={success}>
        Submit
      </Button>
    </Form.Item>
  </Form>
);
export default SetSupply;