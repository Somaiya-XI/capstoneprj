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

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const loadCategories = async () => {
    const {data} = await axios.get(`${import.meta.env.VITE_API_URL}product/catalog-product/get-categories/`);
    console.log(data);
    setCategories(data);
  };

  const loadProducts = async () => {
    const {data} = await axios.get(`${import.meta.env.VITE_API_URL}product/catalog-product/`);
    console.log(data);
    setProducts(data);
  };

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  return (
    <>
      <div id='c'>
        <div id='c' className='md:container md:mx-auto mt-5'>
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
                    <a href='#' className='nav-link'>
                      view all {'>'}
                    </a>
                  </li>
                </ul>
              </div>

              <div className='tab-content'>
                <div className='tab-pane fade active show'>
                  <div className='row'>
                    {products.map((product, index) =>
                      product.discount_percentage !== '0.00' ? (
                        <ProductCard
                          productID={product.product_id}
                          productImage={product.product_img}
                          productName={product.product_name}
                          seller={product.supplier}
                          price={product.new_price}
                          oldPrice={product.price}
                          discount={product.discount_percentage}
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
                    <a href='#' className='nav-link'>
                      view all {'>'}
                    </a>
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
                      <a href='#' className='nav-link'>
                        view all {'>'}
                      </a>
                    </li>
                  </ul>
                </div>

                <div className='tab-content'>
                  <div className='tab-pane fade active show'>
                    <div className='row'>
                      {products.map((product, index) =>
                        product.category === category ? (
                          <ProductCard
                            productID={product.product_id}
                            productImage={product.product_img}
                            productName={product.product_name}
                            seller={product.supplier}
                            price={product.new_price}
                            oldPrice={product.price}
                            discount={product.discount_percentage}
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
