import { Card } from "react-bootstrap";
import "./smallcard.css";

const SmallCard = ({ image, headingTop, headingMiddle, headingBottom }) => {
  return (
    <Card className="mb-5">
      <Card.Img src={image} alt="Card image" style={{ borderRadius: "10px" }} />
      <Card.ImgOverlay>
        <h4>
          {headingTop} <br /> {headingMiddle} <br /> {headingBottom}
        </h4>
      </Card.ImgOverlay>
    </Card>
  );
};

export default SmallCard;
