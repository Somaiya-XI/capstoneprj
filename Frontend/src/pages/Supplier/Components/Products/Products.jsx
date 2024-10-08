// import React, {useEffect, useState} from 'react';
// import { useParams } from "react-router-dom";
// import {Link} from 'react-router-dom';
// import {Button, Table, Popconfirm, Card} from 'antd';
// import {DeleteOutlined, EditOutlined} from '@ant-design/icons';
// import SearchField from '../Layout/SearchField';
// import SupplierLayout from '../Layout/SupplierLayout';
// import { useUserContext, useCsrfContext } from '../../../../Contexts';
// import { API } from '../../../../backend';
// import axios from 'axios';

// const Products = () => {
//   const { id } = useParams();
//   const [dataSource, setDataSource] = useState([]);
//   const {user} = useUserContext();
//   const {csrf} = useCsrfContext();

//   const fetchProducts = async () => {
//     try {
//       const response = await axios.get(`${API}product/get-user-products/${user.id}/`, {
//         withCredentials: true,
//       });
//       console.log("Check it:",csrf)

//       const productsWithKeys = response.data.map((product) => ({
//         ...product,
//         key: product.product_id,
//       }));

//       setDataSource(productsWithKeys);
//       console.log(productsWithKeys)
//     } catch (error) {
//       console.error(error.data);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();

//   }, []);

//   const onDeleteProduct = async (id) => {
//     try {
//         console.log("Attempting to delete product with ID:", id);

//         await axios.delete(`${API}product/catalog/update/`, {
//             data: { id: id },
//             headers: {
//               "X-CSRFToken": csrf,
//             },
//             withCredentials: true,
//         });

//         console.log("Product deleted successfully:", id);

//         const updatedData = dataSource.filter(item => item.key !== id);
//         setDataSource(updatedData);
//     } catch (error) {
//         if (error.response) {
//             console.error('Error deleting product:', error.response.data);
//         } else if (error.request) {
//             console.error('Error deleting product: No response received');
//         } else {
//             console.error('Error deleting product:', error.message);
//         }
//     }
// };

//   const columns = [
//     {
//       title: 'Product Image',
//       dataIndex: 'product_img',
//       width: 180,
//       maxWidth: 80,
//       editable: true,
//       render: (text, record) => {
//         return (
//           <img
//             src={`http://127.0.0.1:8000${record.product_img}`}
//             alt="Product"
//             style={{ maxWidth: '100%', maxHeight: '100%' }}
//             onError={(e) => {
//               e.target.src; // Replace with your fallback image path
//               console.error('Error loading image:', e.target.src);
//             }}
//           />
//         );
//       }
//     },
//     {
//       title: 'Product Name',
//       dataIndex: 'product_name',
//       editable: true,
//     },
//     {
//       title: 'Brand Name',
//       dataIndex: 'brand',
//       editable: true,
//     },
//     {
//       title: 'Description',
//       dataIndex: 'description',
//       width: '10%',
//       editable: true,
//     },
//     {
//       title: 'Category',
//       dataIndex: 'category',
//       width: '10%',
//       editable: true,
//     },
//     {
//       title: 'Price',
//       dataIndex: 'price',
//       editable: true,
//       width: '10%',
//     },
//     {
//       title: 'Discount Percentage',
//       dataIndex: 'discount_percentage',
//       width: '5%',
//       editable: true,
//     },
//     {
//       title: 'Quantity',
//       dataIndex: 'quantity',
//       editable: true,
//     },
//     {
//       title: 'Min order quantity',
//       dataIndex: 'min_order_quantity',
//       editable: true,
//       width: '7%',
//     },
//     // {
//     //   title: 'Production Date',
//     //   dataIndex: 'production_date',
//     //   width: '10%',
//     //   editable: true,
//     // },
//     // {
//     //   title: 'Expiry date',
//     //   dataIndex: 'expiry_date',
//     //   editable: true,
//     // },

//     {
//       title: 'Operation',
//       dataIndex: 'operation',
//       width: '5%',
//       render: (_, record) => (
//         <>
//           <Link to={`/supplier-dashboard/products/edit/${record.key}`}>
//             <EditOutlined style={{fontSize: '20px', cursor: 'pointer'}} />
//           </Link>
//           {dataSource.length >= 1 ? (
//             <Popconfirm title='Sure to delete?' onConfirm={() => onDeleteProduct(record.key)}>
//               <DeleteOutlined style={{color: 'red', marginLeft: 20, fontSize: '18px', cursor: 'pointer'}} />
//             </Popconfirm>
//           ) : null}
//         </>
//       ),
//     },
//   ];

//   return (
//     <SupplierLayout>
//       <div className='SupplierDashboard'>
//         <div className='DashboardContent'>
//           <h3 className='HeaderTitle' data-testid='cypress-title'>
//             Products
//           </h3>
//           <Button className='AddButton' type='primary'>
//             <Link to='/supplier-dashboard/products/add'>+ Add </Link>
//           </Button>
//         </div>

//         <Table
//           data-testid='cypress-Product-table'
//           rowClassName={() => 'editable-row'}
//           bordered
//           dataSource={dataSource}
//           columns={columns}
//           key={dataSource.map((product) => product.key).join()}
//         ></Table>
//       </div>
//     </SupplierLayout>
//   );
// };

// export default Products;
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
import { SearchIcon, EditIcon, DeleteIcon, EyeIcon } from '@/Components/Icons';
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
// import { CustomSuccessToast } from '@/Components/FormComponents/CustomAlerts';


export default function Products() {
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
      product_img: '',
      product_id: '',
      product_name: '',
      brand: '',
      description: '',
      category: '',
      price: '',
      new_price: '',
      discount_percentage: '',
      quantity: '',
      min_order_quantity: '',
      tag_id: '',
      key: '',
    },
  ]);

  const fetchProducts = async () => {
    try {
      const response = await ax.get(`${API}product/get-user-products/${user.id}/`);
      const productsWithKeys = response.data.map((product) => ({
        ...product,
        key: product.product_id,
      }));
      setDataSource(productsWithKeys);
      console.log(productsWithKeys);
    } catch (error) {
      console.error(error.data);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchCategories = () => {
    ax
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
    fetchCategories();
  }, []);

  const columns = [
    {
      title: 'Product Image',
      dataIndex: 'product_img',
      editable: true,
      render: (text, record) => {
        return (
          <img
            src={`http://127.0.0.1:8000${record.product_img}`}
            alt='Product'
            onError={(e) => {
              e.target.src;
              console.error('Error loading image:', e.target.src);
            }}
          />
        );
      },
    },
    {
      title: 'Product Name',
      dataIndex: 'product_name',
    },
    {
      title: 'Brand Name',
      dataIndex: 'brand',
    },
    {
      title: 'Category',
      dataIndex: 'category',
    },
    {
      title: 'Price',
      dataIndex: 'price',
    },
    {
      title: 'Discount',
      dataIndex: 'discount_percentage',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
    },
    {
      title: 'Min order quantity',
      dataIndex: 'min_order_quantity',
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
    },
  ];
  const onDeleteProduct = async (id) => {
    try {
      console.log('Attempting to delete product with ID:', id);
      await ax.delete(`${API}product/catalog/update/`, {
        data: { id: id },
      });

      CustomSuccessToast({ msg: "Product Deleted Successfully!", dur: 5000 });
      console.log('Product deleted successfully:', id);
      const updatedData = dataSource.filter((item) => item.key !== id);
      setDataSource(updatedData);
    } catch (error) {
      if (error.response) {
        // CustomErrorToast({ msg: 'Error deleting a product!', dur: 5000 });
        console.error('Error deleting product:', error.response.data);
      } else if (error.request) {
        console.error('Error deleting product: No response received');
      } else {
        console.error('Error deleting product:', error.message);
      }
    }
    fetchProducts();
  };
  const renderCell = useCallback((product, columnKey) => {
    const cellValue = product[columnKey];
    switch (columnKey) {
      case 'product_img':
        return (
          <Avatar
            radius='lg'
            size='lg'
            name={product['product_name']}
            showFallback
            src={`${imgURL}${cellValue}`}
            classNames={{ img: cellValue ? 'opacity-1' : 'opacity-0' }}
          ></Avatar>
        );
      case 'actions':
        return (
          <div className='relative flex items-center gap-3'>
            <span className='text-lg text-default-400 cursor-pointer active:opacity-50'>
              <EyeIcon onClick={() => navigate(`/supplier_product/${product.key}`)} />
            </span>
            <span className='text-lg text-grey-100 cursor-pointer active:opacity-50'>
              <Link to={`/supplier-dashboard/products/edit/${product.key}`}> 
                <EditIcon className='text-lg text-default-400 cursor-pointer active:opacity-50' />
              </Link>
            </span>


            <Popconfirm title='Sure to delete?' onConfirm={() => onDeleteProduct(product.key)}>
              <DeleteIcon className='text-lg text-danger cursor-pointer active:opacity-50' />
            </Popconfirm>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const items = useMemo(() => {
    let filteredProducts = [...dataSource];

    if (hasSearchFilter) {
      filteredProducts = filteredProducts.filter(
        (prod) =>
          prod.product_name.toLowerCase().includes(filterValue.toLowerCase()) || prod.tag_id && prod.tag_id.includes(filterValue)

      );
    }
    return filteredProducts;
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
    if (name === 'product_img') {
      const file = e.target.files[0];
      if (file) {
        const file64 = await fileToBase64(file);
        console.log('img path', file64);
        setImg(file64);
      }
    } else {
      const dataIndex = dataSource.findIndex((item) => item.key === name);
      const updatedDataSource = [...dataSource];
      updatedDataSource[dataIndex] = {
        ...updatedDataSource[dataIndex],
        [e.target.name]: e.target.value,
      };
      setDataSource(updatedDataSource);
    }

  };

  const handleProductAdd = async () => {
    try {
      const response = await ax.post(`${API}product/catalog/create/`, dataSource);

      console.log(response.data);
      alert('Data Sent');
      navigate('/supplier-dashboard/products');
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
            placeholder='Search by product name or id...'
            startContent={<SearchIcon />}
            value={filterValue}
            onValueChange={onSearchChange}
          />
          <Button className='bg-[#023c07] text-white mt-4 size-24 h-10' type='primary' onClick={onOpen}>
            <Link to='/supplier-dashboard/products/add' className='text-white'>+ Add </Link>
          </Button>
        </div>
      </div>
    );
  }, [filterValue, onSearchChange, hasSearchFilter]);

  return (
    <>
      <SupplierLayout>
        <div className='mx-4'>
          <div className='retailer-dashboard-cont'>
            <h3 className='d-block font-bold' aria-label='Product-Details'>
              Product List
            </h3>
          </div>
          <div className='mt-4'>
            <Table topContent={topContent}>
              <TableHeader columns={columns}>
                {(column) => (
                  <TableColumn key={column.dataIndex} align={column.dataIndex === 'product_name' ? 'start' : 'center'}>
                    {column.title}
                  </TableColumn>
                )}
              </TableHeader>
              <TableBody items={items}>
                {(item) => (
                  <TableRow key={item.key}>
                    {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </SupplierLayout>
      {/* <Modal isOpen={isOpen} onOpenChange={onClose} placement='top-center'>
        <ModalContent>
          <>
            <ModalHeader className='flex flex-col gap-1'>Add New Product</ModalHeader>
            <ModalBody>
              <Input
                label='Tag ID'
                className='w-full'
                placeholder='xxxxxxxxxxxxx'
                value={dataSource.tag_id}
                onChange={handleChange('tag_id')}
                isRequired
              />
              <Input
                label='Product Name'
                className='w-full'
                placeholder='milk 200g'
                value={dataSource.product_name}
                onChange={handleChange('product_name')}
                isRequired
              />
              <Input
                label='Brand'
                className='w-full'
                placeholder='almarai'
                value={dataSource.brand}
                onChange={handleChange('brand')}
                isRequired
              />
              <Input
                type='file'
                label='Product Image'
                placeholder='   '
                className='w-full mb-3'
                labelPlacement='inside'
                value={dataSource.product_img}
                onChange={handleChange('product_img')}
              />
              <Input
                label='description'
                className='w-full'
                value={dataSource.description}
                onChange={handleChange('description')}
                placeholder='Fresh Product that consist of various vitamins'
                labelPlacement='inside'
              />
              <Input
                type='number'
                label='Price'
                className='w-full'
                placeholder='00.00'
                labelPlacement='inside'
                value={dataSource.price}
                onChange={handleChange('price')}
                isRequired
                endContent={
                  <div className='pointer-events-none flex items-center'>
                    <span className='text-default-400 text-small'>SAR</span>
                  </div>
                }
              />
              <Select label='Select Category' className='bg-default-100' isRequired>
                {categories.map((categor) => (
                  <SelectItem key={categor} value={categor}>
                    {categor}
                  </SelectItem>
                ))}
              </Select>
              <Input
                type='number'
                label='Discount'
                className='w-full'
                placeholder='15.00'
                labelPlacement='inside'
                value={dataSource.discount_percentage}
                onChange={handleChange('discount_percentage')}
                isRequired
                endContent={
                  <div className='pointer-events-none flex items-center'>
                    <span className='text-default-400 text-small'>%</span>
                  </div>
                }
              />
              <Input
                type='number'
                label='Minumum Order quantity'
                className='w-full'
                placeholder='5'
                labelPlacement='inside'
                value={dataSource.min_order_quantity}
                onChange={handleChange('min_order_quantity')}
                isRequired
              />
            </ModalBody>
            <ModalFooter>
              <Button color='danger' variant='flat' onClick={onClose}>
                Cancel
              </Button>
              <Button color='primary' onClick={handleProductAdd}>
                Submit
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal> */}
    </>
  );
}
