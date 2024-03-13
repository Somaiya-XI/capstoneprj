import React from 'react';
import { useState } from 'react';
import {useNavigate} from 'react-router-dom'
import SupplierLayout from './Layout/SupplierLayout';

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
const Schedule = () => {
  const [inputData, setInputData] = useState({
    product_img: '',
    product_name: '',
    brand: '',
    description: '',
    category: '',
    price: '',
    discount_percentage: '',
    quantity: '',
    min_order_quantity: '',
    production_date: null,
    expiry_date: null,
    supplier: '',
  });

  const navigate = useNavigate();


return (
  <SupplierLayout>
    <div className="SupplierDashboard">
      <div className="DashboardContent">
        <h3 className="HeaderTitle">Schedule</h3>
        



      </div>

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
  </div>
  </SupplierLayout>
);
}
export default Schedule;