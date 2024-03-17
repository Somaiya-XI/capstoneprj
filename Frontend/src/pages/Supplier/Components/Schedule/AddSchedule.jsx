import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SupplierLayout from '../Layout/SupplierLayout';
import axios from 'axios';
import { useCsrfContext, useUserContext } from '../../../../Contexts';

const AddSchedule = () => {
  const [formData, setFormData] = useState({
    day: '',
    time: '',
    supplier_id: ''
  });
  // const { user } = useUserContext();
  // const { csrf } = useCsrfContext();
  const navigate = useNavigate();


  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .put(`${import.meta.env.VITE_API_URL}schedule/create/`, formData)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log('Error:', err);
        if (err.response) {
          console.log('Server Response Data:', err.response.data);
        }
      });
  };

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



  return (
    <SupplierLayout>
      <div className="SupplierDashboard">
        <div className="DashboardContent">
          <h3 className="HeaderTitle">Supply Schedule</h3>
        </div>
        <div style={{ borderRadius: 24, backgroundColor: 'white', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', padding: 5, paddingLeft: 40, maxWidth: 1555, margin: '0 auto', marginTop: 5 }}>
          <form onSubmit={handleSubmit} className="AddForm" style={{ maxWidth: 1000, padding: 60, borderRadius: 24 }}>
            <div className="form-group mb-3 flex-row" style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
              <label htmlFor="Weekday" style={{ fontSize: 21, whiteSpace: 'nowrap', marginRight: 40 }}>Weekday</label>
              <select className="form-control" id="day" name="day" onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} required style={{ background: 'rgba(0, 0, 0, 0.04)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'transparent' }}>
                <option value="" disabled>Select Weekday</option>
                <option value="mon">Monday</option>
                <option value="tue">Tuesday</option>
                <option value="wed">Wednesday</option>
                <option value="thu">Thursday</option>
                <option value="fri">Friday</option>
                <option value="sat">Saturday</option>
                <option value="sun">Sunday</option>
              </select>
            </div>
            <div className="form-group mb-3 flex-row" style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
              <label htmlFor="Time" style={{ fontSize: 21, whiteSpace: 'nowrap', marginRight: 40 }}>Time</label>
              <input type="time" className="form-control" id="time" name="time" onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} required style={{ background: 'rgba(0, 0, 0, 0.04)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'transparent', marginLeft: 45 }} />
            </div>
            <div className="form-group mb-3 flex-row" style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
              <label htmlFor="SupplierID" style={{ fontSize: 21, whiteSpace: 'nowrap', marginRight: 10 }}>Supplier ID</label>
              <input type="number" className="form-control" id="supplier_id" name="supplier_id" onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} required style={{ background: 'rgba(0, 0, 0, 0.04)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'transparent', marginLeft: 15 }} />
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
              <button type="submit" className="AddButton2">Submit</button>
            </div>
          </form>




        </div>
      </div>
    </SupplierLayout>
  );
};

export default AddSchedule;
