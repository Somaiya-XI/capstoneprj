import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SupplierLayout from '../Layout/SupplierLayout';
import { Link } from 'react-router-dom';
import { Button, Table, Popconfirm } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import ScheduleCard from './ScheduleCard';
import axios from 'axios';


const Schedule = () => {
    const columns = [
        {},
        {}];
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        day: '',
        time: '',
        supplier_id: ''
    });


    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}schedule/`)
            .then((result) => {
                const productsWithKeys = result.data.map(schedule => ({
                    ...schedule,
                    key: schedule.supplier_id
                }));
                setFormData(productsWithKeys);
            })
            .catch(err => console.log(err));
    }, []);


    const handleSubmit = (event) => {
        event.preventDefault();
        axios
            .put(`${import.meta.env.VITE_API_URL}schedule/create/`, formData)
            .then((res) => {
                alert('Data Sent Successfully');
                console.log(res.data);
            })
            .catch((err) => {
                console.log('Error:', err);
                if (err.response) {
                    console.log('Server Response Data:', err.response.data);
                }
            });
    };

    const onDeleteProduct = (key) => {
        const newData = dataSource.filter((item) => item.key !== key);
        setDataSource(newData);
        axios.delete(`${import.meta.env.VITE_API_URL}product/catalog-product/update/`, {
            data: { id: key }
        })

    };



    return (
        <SupplierLayout>
            <div className="SupplierDashboard">
                <div className="DashboardContent">
                    <h3 className="HeaderTitle">Supply Schedule</h3>
                    <Button className="AddButton" type="primary">

                        <Link to="/supplier-dashboard/schedule:add">+ Add </Link>
                    </Button>
                </div>
                <div style={{ borderRadius: 24, backgroundColor: 'white', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', padding: 5, paddingLeft: 40, maxWidth: 1555, margin: '0 auto', marginTop: 5 }}>
                    {/* <form onSubmit={handleSubmit} className="AddForm" style={{ maxWidth: 1000, padding: 60, borderRadius: 24 }}>

                        <div className="form-group mb-3 flex-row" style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
                            <label htmlFor="SupplierID" style={{ fontSize: 21, whiteSpace: 'nowrap', marginRight: 10 }}>Your scheduled weekday is </label>
                        </div>
                        <div className="form-group mb-3 flex-row" style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
                            <label htmlFor="SupplierID" style={{ fontSize: 21, whiteSpace: 'nowrap', marginRight: 10 }}>Your scheduled time is </label>
                        </div>

                        <div className="form-group" style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
                            <button type="submit" className="AddButton2">Change</button>
                        </div>
                    </form> */}
                    <ScheduleCard />
                </div>
            </div>
        </SupplierLayout>
    );
};

export default Schedule;
