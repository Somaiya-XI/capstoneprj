import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Avatar,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Select,
  SelectItem,
} from '@nextui-org/react';
import { Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'; // Assuming these are icons from Ant Design
import { useUserContext } from '@/Contexts';
import { useCsrfContext } from '@/Contexts';
import { API } from '@/backend';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { imgURL } from '@/backend';
import SupplierLayout from '../Layout/SupplierLayout';
import { useNavigate } from 'react-router-dom';
import { useDisclosure } from '@nextui-org/react';
import { fileToBase64 } from '@/Helpers';
import { SearchIcon, EyeIcon } from '@/Components/Icons';

export default function orders() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [filterValue, setFilterValue] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { ax } = useCsrfContext();
  const hasSearchFilter = Boolean(filterValue);
  const { user } = useUserContext();
  const [img, setImg] = useState();
  const { csrf } = useCsrfContext();
  const [dataSource, setDataSource] = useState([
    {
      order_id: '',
      retailer: '',
      order_date: '',
      total_price: '',
      shipping_address: '',
      key: ''
    },
  ]);

  const fetchOrders = () => {
    ax
      .get(`${API}order/view-supplier-orders/`, { user_id: user.id })
      .then((response) => {
        console.log(response.data);
        const ordersWithKeys = response.data
        setDataSource(ordersWithKeys);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);



  const fetchCategories = () => {
    axios
      .get(`${API}category/get`)
      .then((response) => {
        console.log(response.data);
        setCategories(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchOrders();
    fetchCategories();
  }, []);

  const columns = [
    // {
    //   title: 'order Image',
    //   dataIndex: 'order_img',
    //   editable: true,
    //   render: (text, record) => {
    //     return (
    //       <img
    //         src={`http://127.0.0.1:8000${record.order_img}`}
    //         alt="order"
    //         onError={(e) => {
    //           e.target.src;
    //           console.error('Error loading image:', e.target.src);
    //         }}
    //       />
    //     );
    //   }
    // },
    {
      title: 'Order ID',
      dataIndex: 'order_id',
    },
    {
      title: 'Retailer',
      dataIndex: 'retailer',
    },
    {
      title: 'Order date',
      dataIndex: 'order_date',
    },
    {
      title: 'Total Price',
      dataIndex: 'total_price',
    },
    {
      title: 'Shipping Address',
      dataIndex: 'shipping_address',
    },
    // {
    //   title: 'ordered_items',
    //   dataIndex: 'ordered_items',
    // },
    {
      title: 'Orderd Items',
      dataIndex: 'actions',
    },
  ];
  
  const renderCell = useCallback((order, columnKey) => {
    const cellValue = order[columnKey];
    switch (columnKey) {
      case 'order_img':
        return (
          <Avatar
            radius='lg'
            size='lg'
            name={order['order_name']}
            showFallback
            src={`${imgURL}${cellValue}`}
            classNames={{ img: cellValue ? 'opacity-1' : 'opacity-0' }}
          ></Avatar>
        );
      case 'actions':
        return (
          <div className='relative flex items-center gap-3'>
            <span className='text-lg text-default-400 cursor-pointer active:opacity-50'>
              <EyeIcon onClick={() => navigate(`/order/${order.key}`)} />
            </span>
            {/* <span className='text-lg text-default-400 cursor-pointer active:opacity-50'>
              <EditIcon onClick={() => navigate(`/order/${order.key}`)} />
            </span> */}
            {/* <Popconfirm title='Sure to delete?' onConfirm={() => onDeleteorder(order.key)}>
              <DeleteIcon className="text-lg text-danger cursor-pointer active:opacity-50" />
            </Popconfirm> */}
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const items = useMemo(() => {
    let filteredorders = [...dataSource];

    if (hasSearchFilter) {
      filteredorders = filteredorders.filter(
        (prod) =>
          prod.order_name.toLowerCase().includes(filterValue.toLowerCase()) || prod.tag_id.includes(filterValue)
      );
    }
    return filteredorders;
  }, [dataSource, filterValue]);

  const onSearchChange = useCallback((value) => {
    if (value) {
      setFilterValue(value);
    } else {
      setFilterValue('');
    }
  }, []);

  const handleChange = (name) => async (e) => {
    e.preventDefault();
    if (name === 'order_img') {
      const file = e.target.files[0];
      if (file) {
        const file64 = await fileToBase64(file);
        console.log('img path', file64);
        setImg(file64);
      }
    } else {
      const dataIndex = dataSource.findIndex((item) => item.key === name);
      const updatedDataSource = [...dataSource];
      updatedDataSource[dataIndex] = e.target.value;
      setDataSource(updatedDataSource);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await ax.post(`${API}order/catalog/create/`, dataSource);

      console.log(response.data);
      alert('Data Sent');
      navigate('/supplier-dashboard/orders');
    } catch (err) {
      toast.error('Error occurred while submitting data. Please try again.');
      // alert("Error occurred while submitting data. Please try again.");
      console.log(err.response.data);
    }
  };

  const topContent = useMemo(() => {
    return (
      <div className='flex flex-col gap-4'>
        <div className='flex justify-between gap-3 items-end'>
          <Input
            isClearable
            className='w-full sm:max-w-[30%]'
            placeholder='Search by order name or id...'
            startContent={<SearchIcon />}
            value={filterValue}
            onValueChange={onSearchChange}
          />
          {/* <Button className="bg-[#023c07] text-default mt-4 size-24 h-10" type='primary' onClick={onOpen}>
            + Add
          </Button> */}
        </div>
      </div>
    );
  }, [filterValue, onSearchChange, hasSearchFilter]);

  return (
    <>
      <SupplierLayout>
        <div className='mx-4'>
          <div className='retailer-dashboard-cont'>
            <h3 className='d-block font-bold' aria-label='order-Details'>
              Incoming Orders
            </h3>
          </div>
          <div className='mt-4'>
            <Table topContent={topContent}>
              <TableHeader columns={columns}>
                {(column) => (
                  <TableColumn key={column.dataIndex} align={column.dataIndex === 'order_name' ? 'start' : 'center'}>
                    {column.title}
                  </TableColumn>
                )}
              </TableHeader>
              <TableBody>
                {dataSource.map((order) => (
                  <TableRow key={order.key}>
                    <TableCell>{order.order_id}</TableCell>
                    <TableCell>{order.retailer}</TableCell>
                    <TableCell>{order.order_date}</TableCell>
                    <TableCell>{order.total_price}</TableCell>
                    <TableCell>{order.shipping_address}</TableCell>
                    {/* Add additional columns as needed */}
                    <TableCell>
                      <div>
                        <p>Product ID: {order.product_id}</p>
                        <p>Product Name: {order.product_name}</p>
                        <p>New Price: {order.new_price}</p>
                      </div>
                    </TableCell>



                  </TableRow>
                ))}
              </TableBody>


            </Table>
          </div>
        </div>
      </SupplierLayout>
      
    </>
  );
}
