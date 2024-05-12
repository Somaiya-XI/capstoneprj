import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import SupplierLayout from '../Layout/SupplierLayout';
import ScheduleCard from '../Schedule/ScheduleCard';
import { useUserContext, useCsrfContext } from '@/Contexts';
import { API } from '../../../../backend';
import { fileToBase64, imgUrlToBase64 } from '../../../../Helpers';
import { Tooltip, Button } from '@nextui-org/react';
import { toast } from 'sonner';
// import { CustomSuccessToast } from '@/Components/FormComponents/CustomAlerts';

const EditProduct = () => {
  const [categories, setCategories] = useState([])
  const {csrf} = useCsrfContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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
    tag_id: ''
    // production_date: null,
    // expiry_date: null,
  });

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API}product/catalog-product/${id}/`);
      console.log('Check it:', csrf);
      const prod = response.data;
      const {supplier, product_img, ...product} = prod;

      if (product_img) {
        const currentImg = await imgUrlToBase64(product_img);
        product.product_img = currentImg;
      }

      setFormData(product);
    } catch (error) {
      console.error(error.data);
    }
  };

  const fetchCategories =()=>{
    axios.get(`${API}category/get`)
    .then(response =>{
      console.log(response.data)
      setCategories(response.data)
    })
    .catch(error =>{
      console.log(error)
    })
  }

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleDateChange = (name, date) => {
    setFormData({
      ...formData,
      [name]: date,
    });
  };

  const handleChange = (name) => async (event) => {
    if (name === 'product_img') {
      const img = event.target.files[0];
      const image64 = await fileToBase64(img);
      setFormData({
        ...formData,
        product_img: image64,
      });

      // if (img) {
      //   reader.readAsDataURL(img);
      // }
    } else {
      setFormData({
        ...formData,
        [name]: event.target.value,
      });
    }
  };

  function handleSubmit(event) {
    event.preventDefault();
    const requestData = {
      ...formData,
      id: id,
    };

    console.log('Request Object:', requestData); // Log the request object

    axios
      .put(`${API}product/catalog/update/`, requestData, {
        headers: {
          'X-CSRFToken': csrf,
        },
        withCredentials: true,
      })
      .then((response) => {
        CustomSuccessToast({msg: "Product edited successfully!", dur:5000});
        navigate('/supplier-dashboard/products');
      })
      .catch((err) => {
        console.log('Error!!:', err.message);
        if (err.response.data.tag_id) {
          toast.error(err.response.data.tag_id);
          console.log('Server Response Data:', err.response.data);
        }
        if (err.response.data.tag_id) {
          toast.error(rr.response.data.tag_id);
        }else{
        
          console.log('Server Response Data:', err.response.data);
        }
      });
  }
  
  

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
                onChange={handleChange("product_img")}
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
                onChange={handleChange("product_name")}
                required
                style={{ background: 'rgba(0, 0, 0, 0.04)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'transparent' }}
              />
            </div>

            <div className="form-group mb-3 flex-row" style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
              <label htmlFor="tag_id" style={{ fontSize: 21, whiteSpace: 'nowrap', marginRight: 40 }}>Tag ID</label>
              <div  className="flex items-center w-full">
              <input
                type="number"
                className="form-control mr-2"
                id="tag_id"
                name="tag_id"
                value={formData.tag_id}
                onChange={handleChange("tag_id")}
                required
                style={{ background: 'rgba(0, 0, 0, 0.04)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'transparent' }}
              />
              <Tooltip content='Adding a tag ID makes it easier for retailers to find your product' disableAnimation>
              <span class="icon-[solar--danger-circle-bold] bg-red-800 text-base"></span>
              </Tooltip>
              </div>
            </div>

            <div className="form-group mb-3 flex-row" style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
              <label htmlFor="brand" style={{ fontSize: 21, whiteSpace: 'nowrap', marginRight: 40 }}>Brand</label>
              <input
                type="text"
                className="form-control"
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange('brand')}
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
                value={formData.description || ''}
                onChange={handleChange('description')}
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
                onChange={handleChange('category')}
                required
                style={{ background: 'rgba(0, 0, 0, 0.04)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'transparent' }}
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
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
                onChange={handleChange('price')}
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
                onChange={handleChange('discount_percentage')}
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
                onChange={handleChange('quantity')}
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
                onChange={handleChange('min_order_quantity')}
                required
                style={{ background: 'rgba(0, 0, 0, 0.04)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'transparent' }}
              />
            </div>

            {/* <div className="form-group mb-3 flex-row" style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
              <label htmlFor="production_date" style={{ fontSize: 21, whiteSpace: 'nowrap', marginRight: 40 }}>Production Date</label>
              <input
                type="date"
                className="form-control"
                id="production_date"
                name="production_date"
                value={formData.production_date || ""}
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
                value={formData.expiry_date || ""}
                onChange={(e) => handleDateChange('expiry_date', e.target.value)}
                required
                style={{ background: 'rgba(0, 0, 0, 0.04)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'transparent' }}
              />
            </div> */}
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
              <Button type="submit" className="bg-[#023c07] text-white mt-4 size-24 h-10" >Submit</Button>
            </div>
          </form>




        </div>
      </div>
    </SupplierLayout>
  );
};

export default EditProduct;