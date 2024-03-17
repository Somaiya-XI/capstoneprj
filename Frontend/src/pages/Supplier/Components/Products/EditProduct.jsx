import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import SupplierLayout from '../Layout/SupplierLayout';
import ScheduleCard from '../Schedule/ScheduleCard';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    product_img: '',
    product_name: '',
    brand: '',
    description: '',
    category: '',
    price: '',
    discount_percentage: '',
    quantity: '',
    min_order_quantity: '',
    production_date: null,
    expiry_date: null,
    supplier: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}product/catalog-product/${id}/`);
        setFormData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id]);

  const handleDateChange = (name, date) => {
    setFormData({
      ...formData,
      [name]: date
    });
  };

  const handleImageChange = (name) => (event) => {
    if (name === 'product_img') {
      const img = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setFormData({
          ...formData,
          product_img: reader.result,
        });
      };

      if (img) {
        reader.readAsDataURL(img);
      }
    } else {
      setFormData({
        ...formData,
        success: 'Successed!',
        [name]: event.target.value,
      });
    }
  };


  function handleSubmit(event) {
    event.preventDefault();
    axios.put(`${import.meta.env.VITE_API_URL}product/catalog-product/${id}/`, formData)
      .then(res => {
        alert("Data Sent Successfly Ms Bassant!");
        navigate('/SupplierDashboard/Products');
      })
      .catch(err => {
        console.log('Error!!:', err);
        if (err.response) {
          console.log('Server Response Data:', err.response.data);
        }

      });
  };

  return (
    <SupplierLayout>
      <div className="SupplierDashboard">
        <div className="DashboardContent">
          <h3 className="HeaderTitle">Edit Product</h3>
        </div>
        <div
          style={{
            borderRadius: 24,
            backgroundColor: 'white',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            padding: 5,
            paddingLeft: 40,
            maxWidth: 1555,
            margin: '0 auto',
            marginTop: 5,


          }}
        >
          <form onSubmit={handleSubmit} className="AddForm" style={{ maxWidth: 1000, padding: 60, borderRadius: 24 }}>
          <div className="form-group mb-3 flex-row" style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
              <label htmlFor="brand" style={{ fontSize: 21, whiteSpace: 'nowrap', marginRight: 40 }}>Product Image</label>
              <input
                type='file'
                className='form-control'
                name='product_img'
                accept='image/*'
                value={handleImageChange('product_img')}
                
                
                
                style={{ background: 'rgba(0, 0, 0, 0.04)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'transparent' }}
              />
            </div>

            <div className="form-group mb-3 flex-row" style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
              <label htmlFor="product_name" style={{ fontSize: 21, whiteSpace: 'nowrap', marginRight: 40 }}>Product Name</label>
              <input
                type="text"
                className="form-control"
                id="product_name"
                name="product_name"
                value={formData.product_name}
                onChange={e=>setFormData({...formData, product_name:e.target.value})}
                required
                style={{ background: 'rgba(0, 0, 0, 0.04)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'transparent' }}
              />
            </div>

            

            <div className="form-group mb-3 flex-row" style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
              <label htmlFor="brand" style={{ fontSize: 21, whiteSpace: 'nowrap', marginRight: 40 }}>Brand</label>
              <input
                type="text"
                className="form-control"
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={e=>setFormData({...formData, brand:e.target.value})}
                required
                style={{ background: 'rgba(0, 0, 0, 0.04)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'transparent' }}
              />
            </div>

            <div className="form-group mb-3 flex-row" style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
              <label htmlFor="description" style={{ fontSize: 21, whiteSpace: 'nowrap', marginRight: 40 }}>Description</label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                value={formData.description}
                onChange={e=>setFormData({...formData, description:e.target.value})}
                style={{ background: 'rgba(0, 0, 0, 0.04)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'transparent' }}
              />
            </div>

            <div className="form-group mb-3 flex-row" style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
              <label htmlFor="category" style={{ fontSize: 21, whiteSpace: 'nowrap', marginRight: 40 }}>Select Category</label>
              <select
                className="form-control"
                id="category"
                name="category"
                value={formData.category}
                onChange={e=>setFormData({...formData, category:e.target.value})}
                required
                style={{ background: 'rgba(0, 0, 0, 0.04)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'transparent' }}
              >
                <option value="">Select Category</option>
                <option value="Dairy">Dairy</option>
                <option value="Fruit">Fruit</option>
              </select>
            </div>

            <div className="form-group mb-3 flex-row" style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
              <label htmlFor="price" style={{ fontSize: 21, whiteSpace: 'nowrap', marginRight: 40 }}>Product Price</label>
              <input
                type="number"
                className="form-control"
                id="price"
                name="price"
                value={formData.price}
                onChange={e=>setFormData({...formData, price:e.target.value})}
                required
                style={{ background: 'rgba(0, 0, 0, 0.04)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'transparent' }}
              />
            </div>

            <div className="form-group mb-3 flex-row" style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
              <label htmlFor="discount_percentage" style={{ fontSize: 21, whiteSpace: 'nowrap', marginRight: 40 }}>Discount %</label>
              <input
                type="number"
                className="form-control"
                id="discount_percentage"
                name="discount_percentage"
                value={formData.discount_percentage}
                onChange={e=>setFormData({...formData, discount_percentage:e.target.value})}
                style={{ background: 'rgba(0, 0, 0, 0.04)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'transparent' }}
              />
            </div>

            <div className="form-group mb-3 flex-row" style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
              <label htmlFor="quantity" style={{ fontSize: 21, whiteSpace: 'nowrap', marginRight: 40 }}>Quantity</label>
              <input
                type="number"
                className="form-control"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={e=>setFormData({...formData, quantity:e.target.value})}
                required
                style={{ background: 'rgba(0, 0, 0, 0.04)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'transparent' }}
              />
            </div>

            <div className="form-group mb-3 flex-row" style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
              <label htmlFor="min_order_quantity" style={{ fontSize: 21, whiteSpace: 'nowrap', marginRight: 40 }}>Minimum Order Quantity</label>
              <input
                type="number"
                className="form-control"
                id="min_order_quantity"
                name="min_order_quantity"
                value={formData.min_order_quantity}
                onChange={e=>setFormData({...formData, min_order_quantity:e.target.value})}
                required
                style={{ background: 'rgba(0, 0, 0, 0.04)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'transparent' }}
              />
            </div>

            <div className="form-group mb-3 flex-row" style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
              <label htmlFor="production_date" style={{ fontSize: 21, whiteSpace: 'nowrap', marginRight: 40 }}>Production Date</label>
              <input
                type="date"
                className="form-control"
                id="production_date"
                name="production_date"
                value={formData.production_date}
                onChange={(e) => handleDateChange('production_date', e.target.value)}
                required
                style={{ background: 'rgba(0, 0, 0, 0.04)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'transparent' }}
              />
            </div>

            <div className="form-group mb-3 flex-row" style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
              <label htmlFor="expiry_date" style={{ fontSize: 21, whiteSpace: 'nowrap', marginRight: 40 }}>Expiry Date</label>
              <input
                type="date"
                className="form-control"
                id="expiry_date"
                name="expiry_date"
                value={formData.expiry_date}
                onChange={(e) => handleDateChange('expiry_date', e.target.value)}
                required
                style={{ background: 'rgba(0, 0, 0, 0.04)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'transparent' }}
              />
            </div>

            <div className="form-group mb-3 flex-row" style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
              <label htmlFor="supplier" style={{ fontSize: 21, whiteSpace: 'nowrap', marginRight: 40 }}>Supplier</label>
              <input
                type="text"
                className="form-control"
                id="supplier"
                name="supplier"
                value={formData.supplier}
                onChange={e=>setFormData({...formData, upplier:e.target.value})}
                required
                disabled
                style={{ background: 'rgba(0, 0, 0, 0.04)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'transparent' }}
              />
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
              <button type="submit" className="AddButton2" >Submit</button>
            </div>
          </form>




        </div>
      </div>
    </SupplierLayout>
  );
};

export default EditProduct;
