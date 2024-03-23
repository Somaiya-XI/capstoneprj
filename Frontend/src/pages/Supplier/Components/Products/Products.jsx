import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {Button, Table, Popconfirm, Card} from 'antd';
import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
import SearchField from '../Layout/SearchField';
import SupplierLayout from '../Layout/SupplierLayout';
import { useUserContext, useCsrfContext } from '../../../../Contexts';
import { API } from '../../../../backend';
import axios from 'axios';

const Products = () => {
  const [dataSource, setDataSource] = useState([]);
  const {user} = useUserContext();
  const {csrf, setCSRF, getCsrfToken} = useCsrfContext();

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API}product/get-user-products/${user.id}/`, {
        withCredentials: true,
      });
      let csrfToken = response.headers['x-csrftoken'];
      setCSRF(csrfToken);
  
      const productsWithKeys = response.data.map((product) => ({
        ...product,
        key: product.id, // Assign the `id` as the `key`
      }));
  
      setDataSource(productsWithKeys);
    } catch (error) {
      console.error(error);
    }
  };
  
  
  useEffect(() => {
    fetchProducts();
  }, []);
  
  
  

  const onDeleteProduct = async (id) => {
    try {
      // Delete the product from the server
      await axios.delete(`${import.meta.env.VITE_API_URL}product/catalog/update/${id}/`, {
        withCredentials: true,
      });
  
      // Update the local state to remove the deleted product
      const newData = dataSource.filter((item) => item.key !== id);
      setDataSource(newData);
    } catch (error) {
      console.error('Error deleting product:', error);
      // Handle error, e.g., show a notification to the user
    }
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
          <Link to={`/supplier-dashboard/products/edit/${record.key}`}>
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
            <Link to='/supplier-dashboard/products/add'>+ Add </Link>
          </Button>
        </div>

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