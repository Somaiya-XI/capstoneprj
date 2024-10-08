import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  Upload,
  InputNumber,
} from "antd";
import { useNavigate } from "react-router-dom";
import SupplierLayout from "../Layout/SupplierLayout";
import { useCsrfContext } from "../../../../Contexts";
import { API } from "@/backend";
import { toast } from "sonner";
import { Tooltip } from "@nextui-org/react";
// import { CustomSuccessToast } from "@/Components/FormComponents/CustomAlerts";

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
  const {ax} = useCsrfContext();
  const [categories, setCategories] = useState([])
  const [inputData, setInputData] = useState({
    product_img: null,
    product_name: "",
    brand: "",
    description: "",
    category: "",
    price: "",
    discount_percentage: 0,
    quantity: "",
    min_order_quantity: "",
    tag_id: ''
  });

  const navigate = useNavigate();

  const handleInputChange = (key, value) => {
    // if (key === "production_date" || key === "expiry_date") {
    //   value = value ? value.toISOString().split("T")[0] : null;
    // }

    setInputData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  useEffect(() => {
    ax.get(`${API}category/get`)
    .then(response =>{
      console.log(response.data)
      setCategories(response.data)
    })
    .catch(error =>{
      console.log(error)
    })
  }, []);

  const handleSubmit = async () => {
    try {
      const response = await ax.post(
        `${API}product/catalog/create/`,
        inputData
      );

      console.log(response.data);
      CustomSuccessToast({msg: "Product created successfully!", dur:5000});
      navigate("/supplier-dashboard/products");
    } catch (err) {
      toast.error('Error occurred while submitting data. Please try again.');
      // alert("Error occurred while submitting data. Please try again.");
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
          <h3 className='d-block font-bold px-5'>Add Product</h3>
        </div>
        <Form
          className="AddForm"
          {...formItemLayout}
          variant="filled"
          style={{ maxWidth: 1500, padding: 60 }}
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
          {/* {inputData.product_img && (
            <img src={inputData.product_img} alt="Product" />
          )} */}
          <Form.Item
            label="Product Tag ID"
            name="tag_id"
          >
          <div className="flex items-center">
              <Input
              className='mr-2'
              onChange={(e) =>
                handleInputChange("tag_id", e.target.value)
              }
            />
                    
            <Tooltip content='Adding a tag ID makes it easier for retailers to find your product' disableAnimation>
              <span class="icon-[solar--danger-circle-bold] bg-red-800"></span>
              </Tooltip>
            </div>

          </Form.Item>
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
              {categories.map((categor) => (
                <Select.Option key={categor} value={categor}>
                  {categor}
                </Select.Option>
              ))}
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
          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Button type="primary" className='bg-[#023c07] text-white mt-4 size-24 h-10' htmlType="submit">
              Submit
            </Button>

          </Form.Item>
        </Form>
      </div>
    </SupplierLayout>
  );
};

export default AddProduct;
