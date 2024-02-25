import "bootstrap/dist/css/bootstrap.min.css";
import "./output.css";

import SmallCard from "./Components/Card/SmallCard/SmallCard";
import Hero from "./Components/Hero/Hero";
import Navbar from "./Components/Navbar/Navbar";
import NavbarMega from "./Components/Navbar/NavbarMega";
import CustomSlider from "./Components/Slider/CustomSlider";
import { CARD_DATA } from "./constants";
import "./Home.css";
import ProductCard from "./Components/Card/ProductCard/ProductCard";
import Header from "./Components/Header/Header.jsx";
import Footer from "./Components/Footer/Footer.jsx";

import product1 from "./images/product1.png";
import product2 from "./images/product2.png";
import product4 from "./images/product4.png";
import product5 from "./images/product5.png";
import product6 from "./images/product6.png";
import product7 from "./images/product7.png";

const Home = () => {
  return (
    <>
      <Header />
      <div id="c">
        <div id="c" className="md:container md:mx-auto mt-5">
          <Navbar />
          <NavbarMega />
          <Hero />
          <div className="feature_category">
            <div className="section_title mb-5">
              <div className="title d-flex" id="title">
                <h3 className="mr-5">Shop From Top Vendors</h3>
              </div>
            </div>
            <CustomSlider />
            <div className="popular">
              <div
                className="title d-flex justify-content-between mb-5"
                id="title"
              >
                <h3 className="mr-5">Supersaver Up to 50% off</h3>
                <ul className="list-inline nav nav-tabs links">
                  <li className="list-inline-item nav-item">
                    <a href="#" className="nav-link">
                      view all {">"}
                    </a>
                  </li>
                </ul>
              </div>

              <div className="tab-content">
                <div className="tab-pane fade active show">
                  <div className="row">
                    <ProductCard
                      productImage={product1}
                      productName={"Foster Farms Takeout Crispy"}
                      seller={"Lusine"}
                      price={"$20"}
                      oldPrice={"$40"}
                    />
                    <ProductCard
                      productImage={product2}
                      productName={"Foster Farms Takeout Crispy"}
                      seller={"Lusine"}
                      price={"$20"}
                      oldPrice={"$40"}
                    />
                    <ProductCard
                      productImage={product4}
                      productName={"Foster Farms Takeout Crispy"}
                      seller={"Lusine"}
                      price={"$20"}
                      oldPrice={"$40"}
                    />
                    <ProductCard
                      productImage={product5}
                      productName={"Foster Farms Takeout Crispy"}
                      seller={"Lusine"}
                      price={"$20"}
                      oldPrice={"$40"}
                    />
                    <ProductCard
                      productImage={product6}
                      productName={"Foster Farms Takeout Crispy"}
                      seller={"Lusine"}
                      price={"$20"}
                      oldPrice={"$40"}
                    />
                    <ProductCard
                      productImage={product7}
                      productName={"Foster Farms Takeout Crispy"}
                      seller={"Lusine"}
                      price={"$20"}
                      oldPrice={"$40"}
                    />
                    <ProductCard
                      productImage={product1}
                      productName={"Foster Farms Takeout Crispy"}
                      seller={"Lusine"}
                      price={"$20"}
                      oldPrice={"$40"}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div
                className="title d-flex justify-content-between mb-5"
                id="title"
              >
                <h3 className="mr-5">Special Offers</h3>
                <ul className="list-inline nav nav-tabs links">
                  <li className="list-inline-item nav-item">
                    <a href="#" className="nav-link">
                      view all {">"}
                    </a>
                  </li>
                </ul>
              </div>
              {CARD_DATA.map((card, index) => {
                return (
                  <div className="col-md-4" key={index}>
                    <SmallCard image={card.imaage} />
                  </div>
                );
              })}
            </div>
            <div className="popular">
              <div
                className="title d-flex justify-content-between mb-5"
                id="title"
              >
                <h3 className="mr-5">Fruits</h3>
                <ul className="list-inline nav nav-tabs links">
                  <li className="list-inline-item nav-item">
                    <a href="#" className="nav-link">
                      view all {">"}
                    </a>
                  </li>
                </ul>
              </div>

              <div className="tab-content">
                <div className="tab-pane fade active show">
                  <div className="row">
                    <ProductCard
                      productImage={product1}
                      productName={"Foster Farms Takeout Crispy"}
                      seller={"Lusine"}
                      price={"$20"}
                      oldPrice={null}
                    />
                    <ProductCard
                      productImage={product2}
                      productName={"Foster Farms Takeout Crispy"}
                      seller={"Lusine"}
                      price={"$20"}
                      oldPrice={null}
                    />
                    <ProductCard
                      productImage={product4}
                      productName={"Foster Farms Takeout Crispy"}
                      seller={"Lusine"}
                      price={"$20"}
                      oldPrice={null}
                    />
                    <ProductCard
                      productImage={product5}
                      productName={"Foster Farms Takeout Crispy"}
                      seller={"Lusine"}
                      price={"$20"}
                      oldPrice={null}
                    />
                    <ProductCard
                      productImage={product6}
                      productName={"Foster Farms Takeout Crispy"}
                      seller={"Lusine"}
                      price={"$20"}
                      oldPrice={null}
                    />
                    <ProductCard
                      productImage={product7}
                      productName={"Foster Farms Takeout Crispy"}
                      seller={"Lusine"}
                      price={"$20"}
                      oldPrice={null}
                    />
                    <ProductCard
                      productImage={product1}
                      productName={"Foster Farms Takeout Crispy"}
                      seller={"Lusine"}
                      price={"$20"}
                      oldPrice={null}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="popular">
              <div
                className="title d-flex justify-content-between mb-5"
                id="title"
              >
                <h3 className="mr-5">Fruits</h3>
                <ul className="list-inline nav nav-tabs links">
                  <li className="list-inline-item nav-item">
                    <a href="#" className="nav-link">
                      view all {">"}
                    </a>
                  </li>
                </ul>
              </div>

              <div className="tab-content">
                <div className="tab-pane fade active show">
                  <div className="row">
                    <ProductCard
                      productImage={product1}
                      productName={"Foster Farms Takeout Crispy"}
                      seller={"Lusine"}
                      price={"$20"}
                      oldPrice={null}
                    />
                    <ProductCard
                      productImage={product2}
                      productName={"Foster Farms Takeout Crispy"}
                      seller={"Lusine"}
                      price={"$20"}
                      oldPrice={null}
                    />
                    <ProductCard
                      productImage={product4}
                      productName={"Foster Farms Takeout Crispy"}
                      seller={"Lusine"}
                      price={"$20"}
                      oldPrice={null}
                    />
                    <ProductCard
                      productImage={product5}
                      productName={"Foster Farms Takeout Crispy"}
                      seller={"Lusine"}
                      price={"$20"}
                      oldPrice={null}
                    />
                    <ProductCard
                      productImage={product6}
                      productName={"Foster Farms Takeout Crispy"}
                      seller={"Lusine"}
                      price={"$20"}
                      oldPrice={null}
                    />
                    <ProductCard
                      productImage={product7}
                      productName={"Foster Farms Takeout Crispy"}
                      seller={"Lusine"}
                      price={"$20"}
                      oldPrice={null}
                    />
                    <ProductCard
                      productImage={product1}
                      productName={"Foster Farms Takeout Crispy"}
                      seller={"Lusine"}
                      price={"$20"}
                      oldPrice={null}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default Home;
