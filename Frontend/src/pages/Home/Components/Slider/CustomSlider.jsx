import Slider from "react-slick";
import "./customslider.css";
import {
  HiOutlineArrowNarrowLeft,
  HiOutlineArrowNarrowRight,
} from "react-icons/hi";
import Text from "../Navbar/Text";
import { useState, useEffect } from "react";
import axios from "axios";
import icon from "../../images/supplier1.png";
import { API } from "@/backend";


function SampleNextArrow(props) {
  const { className, style, onClick, customCLass } = props;
  return (
    <button
      className={className + " " + customCLass}
      style={{
        ...style,
        display: "block",
        position: "absolute",
        top: "-70px",
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
        top: "-70px",
        right: "25px",
        left: "unset",
      }}
      onClick={onClick}
    >
      <HiOutlineArrowNarrowLeft />
    </button>
  );
}

const CustomSlider = () => {
  const [brands, setBrands] = useState([]);
  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 10,
    slidesToScroll: 1,
    initialSlide: 0,
    nextArrow: <SampleNextArrow customCLass="custom_arrow" />,
    prevArrow: <SamplePrevArrow customCLass="custom_arrow" />,
    responsive: [
      {
        breakpoint: 2000,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5,
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
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const loadBrands = async () => {
    const { data } = await axios.get(
      `${API}product/catalog-product/get-brands/`
    );
    console.log(data);
    setBrands(data);
  };

  useEffect(() => {
    loadBrands();
  }, []);

  return (
    <div className="pb-5">
      <Slider {...settings}>
        {brands.map((brand, index) => {
          return (
            <div key={index}>
              <Text
                icon={icon}
                text={brand}
                type="small"
                customClasses=" small-card"
              />
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default CustomSlider;
