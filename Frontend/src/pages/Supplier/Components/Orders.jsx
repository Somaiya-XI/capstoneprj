// import React, { useState } from 'react';
// import { Form, Input, InputNumber, Popconfirm, Table, Typography, Tag, Modal, Button } from 'antd';
// import SupplierLayout from './Layout/SupplierLayout';
// import SearchField from './Layout/SearchField';



// const originData = [];
// for (let i = 1; i < 100; i++) {
//     originData.push({
//         key: i.toString(),
//         UserEmail: `UserX@gmail.com ${i}`,
//         OrderID: `563${i}541`,
//         OrderDate: `${i}/9/2024`,
//         TotalPrice: `${i}25 Riyals`,
//         PaymentMethod: `STC Pay`,
//         OrderStatus: `Pinned`,
//         ShippingAddress: `6th-Street Neighbrohood`,


//     });
// }

// const EditableCell = ({
//     editing,
//     dataIndex,
//     title,
//     inputType,
//     record,
//     index,
//     children,
//     ...restProps
// }) => {
//     const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
//     return (
//         <td {...restProps}>
//             {editing ? (
//                 <Form.Item
//                     name={dataIndex}
//                     style={{
//                         margin: 0,
//                     }}
//                     rules={[
//                         {
//                             required: true,
//                             message: `Please Input ${title}!`,
//                         },
//                     ]}
//                 >
//                     {inputNode}
//                 </Form.Item>
//             ) : (
//                 children
//             )}
//         </td>
//     );
// };

// const Orders = ({ }) => {
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     const showModal = () => {
//         setIsModalOpen(true);
//     };

//     const handleOk = () => {

//         setIsModalOpen(false);
//     };

//     const handleCancel = () => {
//         setIsModalOpen(false);
//     };
//     const [form] = Form.useForm();
//     const [data, setData] = useState(originData);
//     const [editingKey, setEditingKey] = useState('');
//     const isEditing = (record) => record.key === editingKey;
//     const edit = (record) => {
//         form.setFieldsValue({
//             ProductName: '',
//             ProductImage: '',
//             Description: '',
//             Price: '',
//             Quantity: '',
//             Stock: '',
//             ProductionDate: '',
//             ExpiryDate: '',
//             DiscountPercentage: '',
//             BrandName: '',
//             ...record,
//         });
//         setEditingKey(record.key);
//     };
//     const cancel = () => {
//         setEditingKey('');
//     };
//     const save = async (key) => {
//         try {
//             const row = await form.validateFields();
//             const newData = [...data];
//             const index = newData.findIndex((item) => key === item.key);
//             if (index > -1) {
//                 const item = newData[index];
//                 newData.splice(index, 1, {
//                     ...item,
//                     ...row,
//                 });
//                 setData(newData);
//                 setEditingKey('');
//             } else {
//                 newData.push(row);
//                 setData(newData);
//                 setEditingKey('');
//             }
//         } catch (errInfo) {
//             console.log('Validate Failed:', errInfo);
//         }
//     };

//     const columns = [
//         {
//             title: 'Profile Photo',
//             dataIndex: 'UserImage',
//             editable: true,
//         },
//         {
//             title: 'Email',
//             dataIndex: 'UserEmail',
//             editable: true,
//         },

//         {
//             title: 'Order ID',
//             dataIndex: 'OrderID',
//             editable: true,

//         },
//         {
//             title: 'Order Date',
//             dataIndex: 'OrderDate',
//             editable: true,
//         },
//         {
//             title: 'Total Price',
//             dataIndex: 'TotalPrice',
//             width: "10%",
//             editable: true,
//         },
//         {
//             title: 'Payment Method',
//             dataIndex: 'PaymentMethod',
//             width: "10%",
//             editable: true,
//         },
//         {
//             title: 'Order Status',
//             dataIndex: 'OrderStatus',

//             editable: true,
//         },

//         {
//             title: 'Shipping Address',
//             dataIndex: 'ShippingAddress',

//             editable: true,
//         },

//         {
//             title: 'Order Details',
//             dataIndex: 'OrderDetails',
//             width: "10%",
//             render: (_, record) => {
//                 const editable = isEditing(record);
//                 return editable ? (
//                     <span>
//                         <Typography.Link
//                             onClick={() => save(record.key)}
//                             style={{
//                                 marginRight: 8,
//                             }}
//                         >
//                             Save
//                         </Typography.Link>
//                         <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
//                             <a>Cancel</a>
//                         </Popconfirm>
//                     </span>
//                 ) : (
//                     <>
//                         <Typography.Link onClick={showModal}>
//                             View
//                         </Typography.Link>
//                         <Modal title="Order Details" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
//                             <p>Evaborated Milk 5L - 5 Bulks</p>
//                             <p>Milk Chocolate 1L - 1 Bulk</p>
//                             <p>Canned Milk 8L - 2 Bulks</p>
//                         </Modal>
//                     </>

//                 );
//             },
//         },
//     ];
//     const mergedColumns = columns.map((col) => {
//         if (!col.editable) {
//             return col;
//         }
//         return {
//             ...col,
//             onCell: (record) => ({
//                 record,
//                 inputType: col.dataIndex === 'ProductImag' ? 'image' : 'text',
//                 inputType: col.dataIndex === 'ProductName' ? 'text' : 'text',
//                 inputType: col.dataIndex === 'BrandName' ? 'text' : 'text',
//                 inputType: col.dataIndex === 'Description' ? 'text' : 'text',
//                 inputType: col.dataIndex === 'Price' ? 'number' : 'text',
//                 inputType: col.dataIndex === 'Quantity' ? 'number' : 'text',
//                 inputType: col.dataIndex === 'StockLevel' ? 'number' : 'text',
//                 inputType: col.dataIndex === 'ProductionDate' ? 'date' : 'text',
//                 inputType: col.dataIndex === 'ExpiryDate' ? 'date' : 'text',
//                 inputType: col.dataIndex === 'DiscountPercentage' ? 'number' : 'text',


//                 dataIndex: col.dataIndex,
//                 title: col.title,
//                 editing: isEditing(record),





//             }),
//         };
//     });
//     return (
//         <SupplierLayout>
//             <div className="SupplierDashboard">
//                 <div className="DashboardContent">
//                     <h3 className="HeaderTitle">Orders</h3>


//                 </div><SearchField />
//                 <Form form={form} component={false}>
//                     <Table
//                         components={{
//                             body: {
//                                 cell: EditableCell,
//                             },
//                         }}
//                         bordered
//                         dataSource={data}
//                         columns={mergedColumns}
//                         rowClassName="editable-row"
//                         pagination={{
//                             onChange: cancel,
//                         }}
//                     />
//                 </Form>

//             </div>
//         </SupplierLayout>
//     );
// };
// export default Orders;

import axios from 'axios';
import { useUserContext, useCsrfContext } from '../../../Contexts';
import {useEffect, useState} from 'react';
import { API } from '../../../backend';
import {toast} from 'sonner';

const Test = () => {
  useEffect(() => {
    document.body.style.backgroundColor = 'rgb(23 23 23)';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  const {user} = useUserContext();
  const {csrf} = useCsrfContext();
  const [products, setProducts] = useState(null);

  // option2:

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API}product/get-user-products/${user.id}/`, {
        withCredentials: true,
      });
      const {data} = response;
      console.log(data);
      setProducts(data);
    } catch (error) {
      console.error(error);
    }
  };
  // option1:
  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreateProduct = async () => {
    try {
      const response = await axios.post(
        `${API}product/catalog/create/`,
        {
          product_name: 'Passion Fruit Yogurt',
          price: 15,
          quantity: 120,
          description: ' ',
          product_img: '',
          brand: 'Almarai',
          category: 'Dairy',
          expiry_date: '2024-11-11',
          production_date: '2024-11-11',
        },
        {
          headers: {
            'X-CSRFToken': csrf,
          },
          withCredentials: true,
        }
      );
      console.log('response: ', response);
      return response;
    } catch (error) {
      toastError();
      console.error(error.message);
    }
  };
  const handleCreateSchedule = async () => {
    console.log('csrf is: ', csrf);
    console.log('user id: ', user.id);
    try {
      const response = await axios.post(
        `${API}schedule/create/`,
        {
          day: 'tue',
          time: '01:03:04',
        },
        {
          headers: {
            'X-CSRFToken': csrf,
          },
          withCredentials: true,
        }
      );
      console.log('response: ', response);
      return response;
    } catch (error) {
      toastError();
      console.error(error.message);
    }
  };
  const handleDeleteSchedule = async () => {
    try {
      const response = await axios.post(
        `${API}schedule/delete/`,
        {
          id: 5,
        },
        {
          headers: {
            'X-CSRFToken': csrf,
          },
          withCredentials: true,
        }
      );
      console.log('response: ', response);
      return response;
    } catch (error) {
      toastError();
      console.error(error.message);
    }
  };
  const handleUpdateProduct = async () => {
    try {
      const response = await axios.put(
        `${API}product/catalog/update/`,
        {
          id: 'ab3c743a-76f4-46cf-9f75-b8188bd7c642',
          product_name: 'Product Upadte Name',
        },
        {
          headers: {
            'X-CSRFToken': csrf,
          },
          withCredentials: true,
        }
      );
      console.log('response: ', response);
      return response;
    } catch (error) {
      toastError();
      console.error(error.message);
    }
  };

  const handleDeleteProduct = async () => {
    try {
      const response = await axios.delete(`${API}product/catalog/update/`, {
        data: {id: '0dc08b83-f9d3-4f61-9bcb-a8f4db6f1bfc'},
        headers: {
          'X-CSRFToken': csrf,
        },
        withCredentials: true,
      });
      console.log('response: ', response);
      return response;
    } catch (error) {
      toastError();
      console.error(error.message);
    }
  };
  return (
    <div className='d-flex align-items-center justify-content-center' style={{height: '100vh'}}>
      <button className='btn bg-amber-50 mr-2' onClick={handleCreateProduct}>
        Create Product
      </button>
      <button className='btn bg-indigo-100 mr-2' onClick={handleUpdateProduct}>
        Update Product
      </button>
      <button className='btn bg-rose-50 mr-2' onClick={handleDeleteProduct}>
        Delete Product
      </button>
      <button className='btn bg-emerald-50 mr-2' onClick={handleCreateSchedule}>
        Create Schedule
      </button>
      <button className='btn bg-sky-100 mr-2' onClick={handleDeleteSchedule}>
        Delete Schedule
      </button>
    </div>
  );
};

export default Test;

export function toastError() {
  return toast.error('Server Error! Your not authenticated', {
    duration: 1500,
    position: 'bottom-left',
    style: {background: 'rgb(254 242 242)'},
    className: 'text-dark',
    icon: (
      <Iconify-icon
        className='inline'
        icon='line-md:alert-circle-twotone'
        width='24'
        height='24'
        begin='0s'
        dur='0.6'
        style={{color: ' rgb(127, 29, 29)'}}
      />
    ),
  });
}



