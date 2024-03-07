import React, { useEffect, useState } from 'react';
import { Button, Table, Popconfirm, Modal } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import axios from "axios";
import SearchField from './SearchField';
import AddProduct from './AddProduct.jsx'; 

import "./Supplier.css";

const ProductTable2 = () => {
  const [dataSource, setDataSource] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}product/catalog-product`)
      .then((result) => {
        const productsWithKeys = result.data.map(product => ({
          ...product,
          key: product.product_id
        }));
        setDataSource(productsWithKeys);
      })
      .catch(err => console.log(err));
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onDeleteProduct = (key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
    return axios.delete(`${import.meta.env.VITE_API_URL}product/catalog-product/${key}`);
  };

  const onAddProduct = () => {
    // Logic for adding a product
  };

  const columns = [
    {
      title: 'Product Image',
      dataIndex: 'product_img',
      width: 180,
      maxWidth: 80,
      editable: true,
      render: (text, record) => <img src={record.product_img} alt="Product" />
    },
    {
      title: 'Product Name',
      dataIndex: 'product_name',
      editable: true,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      width: "10%",
      editable: true,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      width: "10%",
      editable: true,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      editable: true,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      editable: true,
    },
    {
      title: 'Production Date',
      dataIndex: 'production_date',
      width: "10%",
      editable: true,
    },
    {
      title: 'Expiry date',
      dataIndex: 'expiry_date',
      editable: true,
    },
    {
      title: 'Discount Percentage',
      dataIndex: 'discount_percentage',
      width: "5%",
      editable: true,
    },
    {
      title: 'Brand Name',
      dataIndex: 'brand',
      editable: true,
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      width: "5%",
      render: (_, record) => (
        <>
          <EditOutlined />
          {dataSource.length >= 1 ? (
            <Popconfirm title="Sure to delete?" onConfirm={() => onDeleteProduct(record.key)}>
              <DeleteOutlined style={{ color: 'red', marginLeft: 25 }} />
            </Popconfirm>
          ) : null}
        </>
      ),
    },
  ];

  return (
    <div className="SupplierDashboard">
      <div className="DashboardContent">
        <h3 className="HeaderTitle">Products</h3>
        <Button className="AddButton" type="primary" onClick={showModal}>
          + Add
        </Button>
        <Modal title="Order Details" visible={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
          <AddProduct /> {/* Render ModalContent component */}
        </Modal>
      </div>
      <SearchField />
      <Table
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource}
        columns={columns}
        key={dataSource.map(product => product.key).join()}
      />
    </div>
  );
};

export default ProductTable2;
