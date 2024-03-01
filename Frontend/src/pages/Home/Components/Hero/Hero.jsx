import "./hero.css";
import { Carousel } from "react-bootstrap";

const Hero = () => {
  return (
    <div className="mt-5 mb-5" variant="dark">
      <Carousel fade variant="dark">
        <Carousel.Item>
          <Carousel.Caption>
            <h1
              className="display-2 mb-5 text-left"
              style={{ fontWeight: 700 }}
            ></h1>
            {/* <p className="mb-5 text-left">Sign up for the daily newsletter</p> */}
            {/* <form className="form-subcriber d-flex text-left">
              <input type="email" placeholder="Your emaill address" />
              <button className="btn" type="submit">
                Subscribe
              </button>
            </form> */}
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item className="carousel-item2">
          <Carousel.Caption>
            {/* <h1
              className="display-2 mb-5 text-left"
              style={{ fontWeight: 700 }}
            >
              Fresh Vegetables <br /> Big Discount
            </h1>
            <p className="mb-5 text-left">
              Save up to 50% off on your first order
            </p>
            <form className="form-subcriber d-flex text-left">
              <input type="email" placeholder="Your emaill address" />
              <button className="btn" type="submit">
                Subscribe
              </button>
            </form> */}
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
  );
};
export default Hero;
