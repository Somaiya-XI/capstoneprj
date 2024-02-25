import Slider from "react-slick";
import { SMALL_CARD_DATA } from "../Card/constants";
import "./customslider.css";
import {
  HiOutlineArrowNarrowLeft,
  HiOutlineArrowNarrowRight,
} from "react-icons/hi";
import Text from "../Navbar/Text";

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

  return (
    <div className="pb-5">
      <Slider {...settings}>
        {SMALL_CARD_DATA.map((card, index) => {
          return (
            <div key={index}>
              <Text
                icon={card.icon}
                text={card.text}
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
