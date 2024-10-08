import 'bootstrap/dist/css/bootstrap.min.css';
import './output.css';

import SmallCard from './Components/Card/SmallCard/SmallCard';
import Hero from './Components/Hero/Hero';
import Navbar from './Components/Navbar/Navbar';
import NavbarMega from './Components/Navbar/NavbarMega';
import CustomSlider from './Components/Slider/CustomSlider';
import {CARD_DATA} from './constants';
import './Home.css';
import ProductCard from './Components/Card/ProductCard/ProductCard';
import Header from './Components/Header/Header.jsx';
import Footer from './Components/Footer/Footer.jsx';
import React from 'react';
import {useState, useEffect} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import {useUserContext} from '../../Contexts/index.jsx';
import { API } from "@/backend";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  const handleChange = (e) => {
    setSearchInput(e.target.value);
};

  const loadCategories = async () => {
    const {data} = await axios.get(`${API}product/catalog-product/get-categories/`);
    setCategories(data);
  };

  const loadProducts = async () => {
    const {data} = await axios.get(`${API}product/catalog-product/get-products/`);
    setProducts(data);
  };

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  return (
    <>
      <div id='c'>
        <Header />
        <div id='c' className='md:container md:mx-auto mt-5'>
          <Navbar handleChange={handleChange}/>
          <NavbarMega />
          <Hero />
          <div className='feature_category'>
            <div className='section_title mb-5'>
              <div className='title d-flex' id='title'>
                <h3 className='mr-5'>Shop From Top Vendors</h3>
              </div>
            </div>
            <CustomSlider />
            <div className='popular'>
              <div className='title d-flex justify-content-between mb-5' id='title'>
                <h3 className='mr-5'>Supersaver Up to 50% off</h3>
                <ul className='list-inline nav nav-tabs links'>
                  <li className='list-inline-item nav-item'>
                    <Link to='#' className='nav-link'>
                      view all {'>'}
                    </Link>
                  </li>
                </ul>
              </div>

              <div className='tab-content'>
                <div className='tab-pane fade active show'>
                  <div className='row'>
                    {products.map((product, index) =>
                      product.discount_percentage !== '0.00' && (product.product_name.toLowerCase().includes(searchInput.toLowerCase()) || 
                      product.company_name.toLowerCase().includes(searchInput.toLowerCase()) || 
                      product.brand.toLowerCase().includes(searchInput.toLowerCase())) ? (
                        <ProductCard
                          productID={product.product_id}
                          productImage={product.product_img}
                          productName={product.product_name}
                          seller={product.company_name}
                          price={product.new_price}
                          oldPrice={product.price}
                          discount={product.discount_percentage}
                          minAllowed={product.min_order_quantity}
                          stock={product.quantity}
                          key={index}
                        />
                      ) : null
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='title d-flex justify-content-between mb-5' id='title'>
                <h3 className='mr-5'>Special Offers</h3>
                <ul className='list-inline nav nav-tabs links'>
                  <li className='list-inline-item nav-item'>
                    <Link to='#' className='nav-link'>
                      view all {'>'}
                    </Link>
                  </li>
                </ul>
              </div>
              {CARD_DATA.map((card, index) => (
                <div className='col-md-4' key={index}>
                  <SmallCard image={card.imaage} />
                </div>
              ))}
            </div>
            {categories.map((category, index) => (
              <div className='popular' key={index}>
                <div className='title d-flex justify-content-between mb-5' id='title'>
                  <h3 className='mr-5'>{category}</h3>
                  <ul className='list-inline nav nav-tabs links'>
                    <li className='list-inline-item nav-item'>
                      <Link to='#' className='nav-link'>
                        view all {'>'}
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className='tab-content'>
                  <div className='tab-pane fade active show'>
                    <div className='row'>
                      {products.map((product, index) =>
                        product.category === category && (product.product_name.toLowerCase().includes(searchInput.toLowerCase()) || 
                        product.company_name.toLowerCase().includes(searchInput.toLowerCase()) || 
                        product.brand.toLowerCase().includes(searchInput.toLowerCase())) ? (
                          <ProductCard
                            productID={product.product_id}
                            productImage={product.product_img}
                            productName={product.product_name}
                            seller={product.company_name}
                            price={product.new_price}
                            oldPrice={product.price}
                            discount={product.discount_percentage}
                            minAllowed={product.min_order_quantity}
                            stock={product.quantity}
                            key={index}
                          />
                        ) : null
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default Home;
