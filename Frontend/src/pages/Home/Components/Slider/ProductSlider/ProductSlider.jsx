import Slider from "react-slick";
import ProductCard from "../../Card/ProductCard/ProductCard";
import {
  HiOutlineArrowNarrowLeft,
  HiOutlineArrowNarrowRight,
} from "react-icons/hi";
const ProductSlider = () => {
  function SampleNextArrow(props) {
    const { className, style, onClick, customCLass } = props;
    return (
      <button
        className={className + " " + customCLass}
        style={{
          ...style,
          display: "block",
          position: "absolute",
        }}
        onClick={onClick}
      >
        <HiOutlineArrowNarrowRight />
      </button>
    );
  }

  function SamplePrevArrow(props) {
    const { className, style, onClick, customCLass } = props;
    console.log(customCLass);
    return (
      <button
        className={className + " " + customCLass}
        style={{
          ...style,
          display: "block",
          position: "absolute",
        }}
        onClick={onClick}
      >
        <HiOutlineArrowNarrowLeft />
      </button>
    );
  }

  var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    nextArrow: <SampleNextArrow customCLass="custom_arrow" />,
    prevArrow: <SamplePrevArrow customCLass="custom_arrow" />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
    ],
  };

  return (
    <Slider {...settings}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((index) => {
        return (
          <div key={index}>
            <ProductCard customClass="slider_card" />
          </div>
        );
      })}
    </Slider>
  );
};
export default ProductSlider;
