import React, { useEffect, useState } from 'react';
import { FiTrash2 } from "react-icons/fi";
import { CiEdit,  } from "react-icons/ci";
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Popconfirm } from 'antd';
import axios from 'axios';

const ScheduleCard = () => {
  const [dataForm, setFormData] = useState({});

  const { id } = useParams();

  
  const getFullWeekdayName = (abbreviation) => {
    const days = {
      sun: 'Sunday',
      mon: 'Monday',
      tue: 'Tuesday',
      wed: 'Wednesday',
      thu: 'Thursday',
      fri: 'Friday',
      sat: 'Saturday'
    };
    return days[abbreviation.toLowerCase()] || abbreviation;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}schedule/`)
        setFormData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [id]);

  const onDeleteProduct = (key) => {
    const newData = { ...dataForm };
    delete newData[key];
    setFormData(newData);
    axios.delete(`${import.meta.env.VITE_API_URL}schedule/delete/`, {
      data: { id: key }
    }).then((response) => {
      console.log(response);
    }).catch((error) => {
      console.error("Error deleting product:", error);
    });
  };

  return (
    <>
      {dataForm && Object.keys(dataForm).map((key, index) => (
        <div key={index}>
          <Card
            style={{ width: '100%', alignItems: 'center' }}
            actions={[
              <Popconfirm title="Sure to delete?" onConfirm={() => onDeleteProduct(key)}>
                <FiTrash2 style={{ color: 'red', marginLeft: 20, fontSize: '18px', cursor: 'pointer' }} key="Delete" />
              </Popconfirm>,
              <CiEdit style={{ fontSize: '20px', cursor: 'pointer' }} key="edit" />
            ]}
            title={`${getFullWeekdayName(dataForm[key].day)} Schedule`}
          >
            <h6>Time: {dataForm[key].time}</h6>
          </Card>
          <br />
        </div>
      ))}
    </>
  );
};

export default ScheduleCard;
