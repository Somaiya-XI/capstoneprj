// import React from 'react';
// import { Space, Table, Tag } from 'antd';
// import "./Supplier.css";
// const columns = [
//   {
//     title: 'Name',
//     dataIndex: 'name',
//     key: 'name',
//     render: (text) => <a>{text}</a>,
//   },
//   {
//     title: 'Age',
//     dataIndex: 'age',
//     key: 'age',
//   },
//   {
//     title: 'Address',
//     dataIndex: 'address',
//     key: 'address',
//   },
//   {
//     title: 'Tags',
//     key: 'tags',
//     dataIndex: 'tags',
//     render: (_, { tags }) => (
//       <>
//         {tags.map((tag) => {
//           let color = tag.length > 5 ? 'geekblue' : 'green';
//           if (tag === 'loser') {
//             color = 'volcano';
//           }
//           return (
//             <Tag color={color} key={tag}>
//               {tag.toUpperCase()}
//             </Tag>
//           );
//         })}
//       </>
//     ),
//   },
//   {
//     title: 'Action',
//     key: 'action',
//     render: (_, record) => (
//       <Space size="middle">
//         <a>Invite {record.name}</a>
//         <a>Delete</a>
//       </Space>
//     ),
//   },
// ];
// const data = [
//   {
//     key: '1',
//     name: 'John Brown',
//     age: 32,
//     address: 'New York No. 1 Lake Park',
//     tags: ['nice', 'developer'],
//   },
//   {
//     key: '2',
//     name: 'Jim Green',
//     age: 42,
//     address: 'London No. 1 Lake Park',
//     tags: ['loser'],
//   },
//   {
//     key: '3',
//     name: 'Joe Black',
//     age: 32,
//     address: 'Sydney No. 1 Lake Park',
//     tags: ['cool', 'teacher'],
//   },
//   {
//     key: '3',
//     name: 'Joe Black',
//     age: 32,
//     address: 'Sydney No. 1 Lake Park',
//     tags: ['cool', 'teacher'],
//   },
//   {
//     key: '3',
//     name: 'Joe Black',
//     age: 32,
//     address: 'Sydney No. 1 Lake Park',
//     tags: ['cool', 'teacher'],
//   },
//   {
//     key: '3',
//     name: 'Joe Black',
//     age: 32,
//     address: 'Sydney No. 1 Lake Park',
//     tags: ['cool', 'teacher'],
//   },
//   {
//     key: '3',
//     name: 'Joe Black',
//     age: 32,
//     address: 'Sydney No. 1 Lake Park',
//     tags: ['cool', 'teacher'],
//   },


// ];
// const ProductTable = () => <Table columns={columns} dataSource={data} />;
// export default ProductTable;

import React, { useState } from 'react';
import { Form, Input, InputNumber, Popconfirm, Table, Typography, Tag } from 'antd';
import PropTypes from 'prop-types';

const originData = [];
for (let i = 1; i < 100; i++) {
  originData.push({
    key: i.toString(),
    ProductName: `Canderial Chocolate ${i}`,
    Price: `${i} Riyals`,
    Quantity: `${i} Bulks`,
    Stock:`${i} Bulks`,
    
    
  });
}

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const ProductTable = ({ }) => {
  const [form] = Form.useForm();
  const [data, setData] = useState(originData);
  const [editingKey, setEditingKey] = useState('');
  const isEditing = (record) => record.key === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      ProductName: '',
      ProductImage: '',
      Description: '',
      Price: '',
      Quantity: '',
      Stock: '',
      ProductionDate: '',
      ExpiryDate: '',
      DiscountPercentage: '',
      BrandName: '',
      ...record,
    });
    setEditingKey(record.key);
  };
  const cancel = () => {
    setEditingKey('');
  };
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const columns = [
    {
      title: 'Product Image',
      dataIndex: 'ProductImage',

      editable: true,
    },
    {
      title: 'Product Name',
      dataIndex: 'ProductName',

      editable: true,
    },
    {
      title: 'Description',
      dataIndex: 'Description',
      width: "10%",
      editable: true,
    },
    {
      title: 'Category',
      dataIndex: 'Category',
      width: "10%",
      editable: true,
    },
    {
      title: 'Price',
      dataIndex: 'Price',
      editable: true,

    },
    {
      title: 'Quantity',
      dataIndex: 'Quantity',

      editable: true,
    },
    {
      title: 'Stock Level',
      dataIndex: 'StockLevel',
      editable: true,
      // render: (_, { StockLevel }) => (
      //   <>
      //     {StockLevel.map((Stock) => {
      //       let color = Stock.length > 5 ? 'geekblue' : 'green';
      //       if ( Stock === 'Full') {
      //         color = 'volcano';
      //       }
      //       return (
      //         <Tag color={color} key={Stock}>
      //           {Stock.toUpperCase()}
      //         </Tag>
      //       );
      //     })}
      //   </>
      // ),
    },
    {
      title: 'Production Date',
      dataIndex: 'ProductionDate',
      width: "10%",
      editable: true,
    },
    {
      title: 'Expiry date',
      dataIndex: 'ExpiryDate',

      editable: true,
    },
    {
      title: 'Discount Percentage',
      dataIndex: 'DiscountPercentage',
      width: "5%",
      editable: true,
    },
    {
      title: 'Brand Name',
      dataIndex: 'BrandName',

      editable: true,
    },

    {
      title: 'operation',
      dataIndex: 'operation',
      width: "10%",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            Edit
          </Typography.Link>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'ProductImage' ? 'image' : 'text',
        inputType: col.dataIndex === 'ProductName' ? 'text' : 'text',
        inputType: col.dataIndex === 'BrandName' ? 'text' : 'text',
        inputType: col.dataIndex === 'Description' ? 'text' : 'text',
        inputType: col.dataIndex === 'Price' ? 'number' : 'text',
        inputType: col.dataIndex === 'Quantity' ? 'number' : 'text',
        inputType: col.dataIndex === 'StockLevel' ? 'number' : 'text',
        inputType: col.dataIndex === 'ProductionDate' ? 'date' : 'text',
        inputType: col.dataIndex === 'ExpiryDate' ? 'date' : 'text',
        inputType: col.dataIndex === 'DiscountPercentage' ? 'number' : 'text',


        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),





      }),
    };
  });
  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
      />
    </Form>
  );
};
export default ProductTable;

// New Table


export const ProductTable2 = () => {



}


