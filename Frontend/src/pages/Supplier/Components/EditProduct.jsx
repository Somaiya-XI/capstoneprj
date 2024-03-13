import React, { useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Select, DatePicker, Upload, InputNumber } from 'antd';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import SupplierLayout from './Layout/SupplierLayout';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dataSource, setDataSource] = useState({
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}product/catalog-product/${id}/`);
        setDataSource(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (key, value) => {
    if (key === 'production_date' || key === 'expiry_date') {
      value = value ? value.toISOString().split('T')[0] : null;
    }
    setDataSource(prevState => ({
      ...prevState,
      [key]: value
    }));
  };

  const onUpdateProduct = () => {
    console.log('Update product:', dataSource);
    // Add your update logic here
  };

  return (
    <SupplierLayout>
      <div className="SupplierDashboard">
        <div className="DashboardContent">
          <h3 className="HeaderTitle">Edit Product</h3>
        </div>
        <Form
          className="AddForm"
          {...formItemLayout}
          variant="filled"
          style={{ maxWidth: 500, padding: 60 }}
          dataSource={dataSource}
          onFinish={onUpdateProduct}
        >
          {/* <Form.Item label="Upload Image" name="product_img" valuePropName="fileList">
            <Upload action="/upload.do" listType="picture-card" onChange={e => handleInputChange('product_img', e.target.value)}>
              <button style={{ border: 0, background: 'none' }} type="button">
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </button>
            </Upload>
          </Form.Item> */}

          <Form.Item
            label="Product Name"
            name="product_name"
            rules={[{ required: true, message: 'Please Write Product Name!' }]}

          >
            <Input value = {dataSource.product_name}/>
          </Form.Item>

          <Form.Item
            label="Brand"
            name="brand"
            rules={[{ required: true, message: 'Please enter Brand!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            label="Select Category"
            name="category"
            rules={[{ required: true, message: 'Please select category!' }]}
          >
            <Select>
              <Select.Option value="Dairy">Dairy</Select.Option>
              <Select.Option value="Fruit">Fruit</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Product Price"
            name="price"
            rules={[{ required: true, message: 'Please enter product price!' }]}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item
            label="Discount %"
            name="discount_percentage"
          >
            <InputNumber />
          </Form.Item>

          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[{ required: true, message: 'Please enter product quantity!' }]}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item
            label="Minimum Order Quantity"
            name="min_order_quantity"
            rules={[{ required: true, message: 'Please enter minimum order quantity!' }]}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item
            label="Production Date"
            name="production_date"
            rules={[{ required: true, message: 'Please Select Production Date!' }]}
          >
            <DatePicker />
          </Form.Item>

          <Form.Item
            label="Expiry Date"
            name="expiry_date"
            rules={[{ required: true, message: 'Please Select Expiry Date!' }]}
          >
            <DatePicker />
          </Form.Item>

          <Form.Item
            label="Supplier"
            name="supplier"
            rules={[{ required: true, message: 'Please enter supplier!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Button type="primary" className="AddButton2" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </SupplierLayout>
  );
};

export default EditProduct;
