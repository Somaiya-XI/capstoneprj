import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {Button, Table, Popconfirm} from 'antd';
import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
import axios from 'axios';
import SearchField from './Layout/SearchField';
import SupplierLayout from './Layout/SupplierLayout';

const Products = () => {
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}product/catalog-product`)
      .then((result) => {
        const productsWithKeys = result.data.map((product) => ({
          ...product,
          key: product.product_id,
        }));
        setDataSource(productsWithKeys);
      })
      .catch((err) => console.log(err));
  }, []);

  const onDeleteProduct = (key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
    axios.delete(`${import.meta.env.VITE_API_URL}product/catalog-product/update/`, {
      data: {id: key},
    });
  };

  // const onAddProduct = () => {
  //   setDataSource(pre=>{
  //     const newProduct= {

  //     }
  //     return [...pre, newProduct]
  //   })

  //   axios.delete(`${import.meta.env.VITE_API_URL}product/catalog-product/create/`, {

  //   })

  // };

  const columns = [
    {
      title: 'Product Image',
      dataIndex: 'product_img',
      width: 180,
      maxWidth: 80,
      editable: true,
      render: (text, record) => <img src={record.product_img} alt='Product' />,
    },
    {
      title: 'Product Name',
      dataIndex: 'product_name',
      editable: true,
    },
    {
      title: 'Brand Name',
      dataIndex: 'brand',
      editable: true,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      width: '10%',
      editable: true,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      width: '10%',
      editable: true,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      editable: true,
      width: '10%',
    },
    {
      title: 'Discount Percentage',
      dataIndex: 'discount_percentage',
      width: '5%',
      editable: true,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      editable: true,
    },
    {
      title: 'Min order quantity',
      dataIndex: 'min_order_quantity',
      editable: true,
      width: '7%',
    },
    {
      title: 'Production Date',
      dataIndex: 'production_date',
      width: '10%',
      editable: true,
    },
    {
      title: 'Expiry date',
      dataIndex: 'expiry_date',
      editable: true,
    },

    {
      title: 'Operation',
      dataIndex: 'operation',
      width: '5%',
      render: (_, record) => (
        <>
          <EditOutlined>navigate("/SupplierDashboard/Edit");</EditOutlined>
          {dataSource.length >= 1 ? (
            <Popconfirm title='Sure to delete?' onConfirm={() => onDeleteProduct(record.key)}>
              <DeleteOutlined style={{color: 'red', marginLeft: 25}} />
            </Popconfirm>
          ) : null}
        </>
      ),
    },
  ];

  return (
    <SupplierLayout>
      <div className='SupplierDashboard'>
        <div className='DashboardContent'>
          <h3 className='HeaderTitle'>Products</h3>
          <Button className='AddButton' type='primary'>
            <Link to='/SupplierDashboard/Add'>+ Add </Link>
          </Button>
        </div>
        <SearchField />

        <Table
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={columns}
          key={dataSource.map((product) => product.key).join()}
        />
      </div>
    </SupplierLayout>
  );
};

export default Products;
