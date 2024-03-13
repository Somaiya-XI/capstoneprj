import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Select, DatePicker, Upload, InputNumber } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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

const AddProduct = () => {
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



  const handleInputChange = (key, value) => {
    if (key === 'production_date' || key === 'expiry_date') {
      // Format date to YYYY-MM-DD
      value = value ? value.toISOString().split('T')[0] : null;
    }

    setInputData(prevState => ({
      ...prevState,
      [key]: value
    }));
  };

  const handleChange = (name) => (info) => {
    if (name === 'product_img') {
      const { file, fileList } = info;

      // Validate file type or size if needed
      const isValidType = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isValidType) {
        message.error('You can only upload JPG/PNG file!');
        return false; // Return false to prevent upload
      }

      if (file.status === 'done') {
        const updatedFileList = [...fileList];
        // Limiting the number of uploaded files to 1
        updatedFileList.splice(-1, updatedFileList.length - 1);
        setInputData({ product_img: updatedFileList });

      }
    }
  };




  const handleSubmit = () => {
    axios.post(`${import.meta.env.VITE_API_URL}product/catalog-product/create/`, inputData)
      .then(res => {
        alert("Data Sent");
        navigate('/SupplierDashboard/Products');
      })
      .catch(err => {
        console.log('Error:', err);
        if (err.response) {

          console.log('Server Response Data:', err.response.data);
        }

      });
  };

  return (
    <SupplierLayout>
      <div className="SupplierDashboard">
        <div className="DashboardContent">
          <h3 className="HeaderTitle">Add Product</h3>




        </div>
        <Form
          className="AddForm"
          {...formItemLayout}
          variant="filled"
          style={{ maxWidth: 500, padding: 60 }}
          onFinish={handleSubmit}
          childrenColumnName="antdChildren"
        >
          <Form.Item label="Upload Image" name="product_img" valuePropName="fileList">
            <Upload
              action="/upload.do"
              listType="picture-card"
              onChange={handleChange('product_img')}
              
              fileList={inputData.product_img}
            >
              {inputData.product_img.length === 0 && (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item
            label="Product Name"
            name="product_name"
            rules={[{ required: true, message: 'Please Write Product Name!' }]}
          >
            <Input onChange={e => handleInputChange('product_name', e.target.value)} />
          </Form.Item>

          <Form.Item
            label="Brand"
            name="brand"
            rules={[{ required: true, message: 'Please enter Brand!' }]}
          >
            <Input onChange={e => handleInputChange('brand', e.target.value)} />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
          >
            <Input.TextArea onChange={e => handleInputChange('description', e.target.value)} />
          </Form.Item>

          <Form.Item
            label="Select Category"
            name="category"
            rules={[{ required: true, message: 'Please select category!' }]}
          >
            <Select onChange={value => handleInputChange('category', value)}>
              <Select.Option value="Dairy">Dairy</Select.Option>
              <Select.Option value="Fruit">Fruit</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Product Price"
            name="price"
            rules={[{ required: true, message: 'Please enter product price!' }]}
          >
            <InputNumber onChange={value => handleInputChange('price', value)} />
          </Form.Item>

          <Form.Item
            label="Discount %"
            name="discount_percentage"
          >
            <InputNumber onChange={value => handleInputChange('discount_percentage', value)} />
          </Form.Item>

          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[{ required: true, message: 'Please enter product quantity!' }]}
          >
            <InputNumber onChange={value => handleInputChange('quantity', value)} />
          </Form.Item>

          <Form.Item
            label="Minimum Order Quantity"
            name="min_order_quantity"
            rules={[{ required: true, message: 'Please enter minimum order quantity!' }]}
          >
            <InputNumber onChange={value => handleInputChange('min_order_quantity', value)} />
          </Form.Item>

          <Form.Item
            label="Production Date"
            name="production_date"
            rules={[{ required: true, message: 'Please Select Production Date!' }]}
          >
            <DatePicker onChange={date => handleInputChange('production_date', date)} />
          </Form.Item>

          <Form.Item
            label="Expiry Date"
            name="expiry_date"
            rules={[{ required: true, message: 'Please Select Expiry Date!' }]}
          >
            <DatePicker onChange={date => handleInputChange('expiry_date', date)} />
          </Form.Item>

          <Form.Item
            label="Supplier"
            name="supplier"
            rules={[{ required: true, message: 'Please enter supplier!' }]}
          >
            <Input onChange={e => handleInputChange('supplier', e.target.value)} />
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

export default AddProduct;