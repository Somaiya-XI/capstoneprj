import React, { useState } from 'react';
import { Form, Input, InputNumber, Popconfirm, Table, Typography, Tag, Modal, Button } from 'antd';
import SupplierLayout from '../SupplierLayout';
import SearchField from './Layout/SearchField';



const originData = [];
for (let i = 1; i < 100; i++) {
    originData.push({
        key: i.toString(),
        UserEmail: `UserX@gmail.com ${i}`,
        OrderID: `563${i}541`,
        OrderDate: `${i}/9/2024`,
        TotalPrice: `${i}25 Riyals`,
        PaymentMethod: `STC Pay`,
        OrderStatus: `Pinned`,
        ShippingAddress: `6th-Street Neighbrohood`,


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

const Orders = ({ }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {

        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
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
            title: 'Profile Photo',
            dataIndex: 'UserImage',
            editable: true,
        },
        {
            title: 'Email',
            dataIndex: 'UserEmail',
            editable: true,
        },

        {
            title: 'Order ID',
            dataIndex: 'OrderID',
            editable: true,

        },
        {
            title: 'Order Date',
            dataIndex: 'OrderDate',
            editable: true,
        },
        {
            title: 'Total Price',
            dataIndex: 'TotalPrice',
            width: "10%",
            editable: true,
        },
        {
            title: 'Payment Method',
            dataIndex: 'PaymentMethod',
            width: "10%",
            editable: true,
        },
        {
            title: 'Order Status',
            dataIndex: 'OrderStatus',

            editable: true,
        },

        {
            title: 'Shipping Address',
            dataIndex: 'ShippingAddress',

            editable: true,
        },

        {
            title: 'Order Details',
            dataIndex: 'OrderDetails',
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
                    <>
                        <Typography.Link onClick={showModal}>
                            View
                        </Typography.Link>
                        <Modal title="Order Details" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                            <p>Evaborated Milk 5L - 5 Bulks</p>
                            <p>Milk Chocolate 1L - 1 Bulk</p>
                            <p>Canned Milk 8L - 2 Bulks</p>
                        </Modal>
                    </>

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
                inputType: col.dataIndex === 'ProductImag' ? 'image' : 'text',
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
        <SupplierLayout>
            <div className="SupplierDashboard">
                <div className="DashboardContent">
                    <h3 className="HeaderTitle">Orders</h3>


                </div><SearchField />
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

            </div>
        </SupplierLayout>
    );
};
export default Orders;




