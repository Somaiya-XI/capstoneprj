import React, { useEffect, useState } from 'react';
import { Button, Popconfirm, Table, Typography } from 'antd';
import {
  DeleteOutlined,
} from '@ant-design/icons';
import axios from "axios";

import "./Supplier.css";
import SearchField from './SearchField';


const ProductTable2 = () => {
  const [dataSource, setDataSource] = useState([
  ]);
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}product/catalog-product`)
      .then((result) => { setDataSource(result.data) })
      .catch(err => console.log(err))

  }, []);

  const columns = [
    {
      title: 'Product Image',
      dataIndex: 'product_img',
      width: 180,
      maxWidth: 80,
      editable: true,
      render: (t, r) => <img src={`${r.product_img}`} />
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
      title: 'operation',
      dataIndex: 'operation',
      width: "10%",
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <>
            <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
              <DeleteOutlined className="Delete" />
            </Popconfirm>
          </>
        ) : isEditing ? (
          <>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Savedddd
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </>
        ) : (
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            Edit
          </Typography.Link>
        ),
    },
  ];

  return (
    <div className="SupplierDashboard">
      <div className="DashboardContent">
        <h3 className="HeaderTitle">Products</h3>
        <Button className="AddButton" type="primary">
          + Add
        </Button>
      </div>
      <SearchField />
      <Table
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource}
        columns={columns}
      />
    </div>
  );
};
export default ProductTable2;
