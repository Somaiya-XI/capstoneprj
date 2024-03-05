import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Popconfirm, Table, Typography } from 'antd';
import {
    DeleteOutlined,
} from '@ant-design/icons';

import "./Supplier.css";
import SearchField from './SearchField';
const EditableContext = React.createContext(null);
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};
const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);
  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };
  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({
        ...record,
        ...values,
      });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };
  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};
const ProductTable2 = () => {
    const [editingKey, setEditingKey] = useState('');
    const [data, setData] = useState([]);
    const [dataSource, setDataSource] = useState([
      {
        key: '0',
        name: 'Edward King 0',
        age: '32',
        address: 'London, Park Lane no. 0',
      },
      {
        key: '1',
        name: 'Edward King 1',
        age: '32',
        address: 'London, Park Lane no. 1',
      },
    ]);
    const [count, setCount] = useState(2);

    const handleDelete = (key) => {
      const newData = dataSource.filter((item) => item.key !== key);
      setDataSource(newData);
    };

    const isEditing = (record) => record.key === editingKey;

    const edit = (record) => {
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

    const handleAdd = () => {
      const newData = {
        key: count,
        name: `Edward King ${count}`,
        age: '32',
        address: `London, Park Lane no. ${count}`,
      };
      setDataSource([...dataSource, newData]);
      setCount(count + 1);
    };

    const handleSave = (row) => {
      const newData = [...dataSource];
      const index = newData.findIndex((item) => row.key === item.key);
      const item = newData[index];
      newData.splice(index, 1, {
        ...item,
        ...row,
      });
      setDataSource(newData);
    };

    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };

    const defaultColumns = [
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

    const columns = defaultColumns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave,
        }),
      };
    });

    return (
      <div className="SupplierDashboard">
        <div className="DashboardContent">
          <h3 className="HeaderTitle">Products</h3>
          <Button className="AddButton" type="primary" onClick={handleAdd}>
            + Add
          </Button>
        </div>
        <SearchField/>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={columns}
        />
      </div>
    );
};
export default ProductTable2;
