import React, { useState, useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  Upload,
  InputNumber,
} from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SupplierLayout from "../Layout/SupplierLayout";
import { useCsrfContext } from "../../../../Contexts";
import { API } from "../../../../backend";
import { toastError } from "../Orders";

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
  const { csrf, getCsrfToken } = useCsrfContext();
  const [inputData, setInputData] = useState({
    product_img: "",
    product_name: "",
    brand: "",
    description: "",
    category: "",
    price: "",
    discount_percentage: "",
    quantity: "",
    min_order_quantity: "",
    production_date: null,
    expiry_date: null,
  });

  const navigate = useNavigate();

  const handleInputChange = (key, value) => {
    if (key === "production_date" || key === "expiry_date") {
      value = value ? value.toISOString().split("T")[0] : null;
    }

    setInputData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  useEffect(() => {
    getCsrfToken();
  }, []);

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `${API}product/catalog/create/`,
        inputData,
        {
          headers: {
            "X-CSRFToken": csrf,
          },
          withCredentials: true,
        }
      );

      console.log(response.data);
      alert("Data Sent");
      navigate("/supplier-dashboard/products");
    } catch (err) {
      toastError();
      alert("Error occurred while submitting data. Please try again.");
      console.log(err.response.data);
    }
  };

  const handleImageChange = (event) => {
    const img = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setInputData({
        ...inputData,
        product_img: reader.result,
      });
    };

    if (img) {
      reader.readAsDataURL(img);
    }
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
          <Form.Item
            label="Upload Image"
            name="product_img"
            valuePropName="fileList"
          >
            <input
              type="file"
              className="form-control"
              name="product_img"
              accept="image/*"
              onChange={handleImageChange}
              style={{
                background: "rgba(0, 0, 0, 0.04)",
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: "transparent",
              }}
            />
          </Form.Item>
          {inputData.product_img && (
            <img src={inputData.product_img} alt="Product" />
          )}

          <Form.Item
            label="Product Name"
            name="product_name"
            rules={[{ required: true, message: "Please Write Product Name!" }]}
          >
            <Input
              onChange={(e) =>
                handleInputChange("product_name", e.target.value)
              }
            />
          </Form.Item>

          <Form.Item
            label="Brand"
            name="brand"
            rules={[{ required: true, message: "Please enter Brand!" }]}
          >
            <Input
              onChange={(e) => handleInputChange("brand", e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="Select Category"
            name="category"
            rules={[{ required: true, message: "Please select category!" }]}
          >
            <Select onChange={(value) => handleInputChange("category", value)}>
              <Select.Option value="Dairy">Dairy</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Product Price"
            name="price"
            rules={[{ required: true, message: "Please enter product price!" }]}
          >
            <InputNumber
              onChange={(value) => handleInputChange("price", value)}
            />
          </Form.Item>

          <Form.Item label="Discount %" name="discount_percentage">
            <InputNumber
              onChange={(value) =>
                handleInputChange("discount_percentage", value)
              }
            />
          </Form.Item>

          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[
              { required: true, message: "Please enter product quantity!" },
            ]}
          >
            <InputNumber
              onChange={(value) => handleInputChange("quantity", value)}
            />
          </Form.Item>

          <Form.Item
            label="Minimum Order Quantity"
            name="min_order_quantity"
            rules={[
              {
                required: true,
                message: "Please enter minimum order quantity!",
              },
            ]}
          >
            <InputNumber
              onChange={(value) =>
                handleInputChange("min_order_quantity", value)
              }
            />
          </Form.Item>

          <Form.Item
            label="Production Date"
            name="production_date"
            rules={[
              { required: true, message: "Please Select Production Date!" },
            ]}
          >
            <DatePicker
              onChange={(date) => handleInputChange("production_date", date)}
            />
          </Form.Item>

          <Form.Item
            label="Expiry Date"
            name="expiry_date"
            rules={[{ required: true, message: "Please Select Expiry Date!" }]}
          >
            <DatePicker
              onChange={(date) => handleInputChange("expiry_date", date)}
            />
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
