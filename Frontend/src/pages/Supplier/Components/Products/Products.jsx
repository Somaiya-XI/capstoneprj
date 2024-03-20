import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {Button, Table, Popconfirm, Card} from 'antd';
import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
import SearchField from '../Layout/SearchField';
import SupplierLayout from '../Layout/SupplierLayout';
import axios from 'axios';

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
          <Link to={`/supplier-dashboard/products:edit/${record.key}`}>
            <EditOutlined style={{fontSize: '20px', cursor: 'pointer'}} />
          </Link>
          {dataSource.length >= 1 ? (
            <Popconfirm title='Sure to delete?' onConfirm={() => onDeleteProduct(record.key)}>
              <DeleteOutlined style={{color: 'red', marginLeft: 20, fontSize: '18px', cursor: 'pointer'}} />
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
          <h3 className='HeaderTitle' data-testid='cypress-title'>
            Products
          </h3>
          <Button className='AddButton' type='primary'>
            <Link to='/supplier-dashboard/products:add'>+ Add </Link>
          </Button>
        </div>
        <SearchField />

        <Table
          data-testid='cypress-Product-table'
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={columns}
          key={dataSource.map((product) => product.key).join()}
        ></Table>
      </div>
    </SupplierLayout>
  );
};

export default Products;