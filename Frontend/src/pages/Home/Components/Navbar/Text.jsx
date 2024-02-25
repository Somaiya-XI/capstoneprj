const Text = ({ icon, text, customClasses, type, items }) => {
  return (
    <div
      className={`${
        type !== "small" ? "d-flex align-items-center" : ""
      }  ${customClasses}`}
    >
      {icon && type === undefined && (
        <img
          src={icon}
          alt=""
          style={{
            maxWidth: "50px",
            marginRight: "15px",
          }}
        />
      )}
      {icon && type === "small" && (
        <figure>
          <a href="#">
            <img src={icon} alt="" />
          </a>
        </figure>
      )}
      {text && type === undefined && <a href="#">{text}</a>}

      {icon && type === "small" && (
        <h6>
          <a href="#">{text}</a>
        </h6>
      )}

      {items && type === "small" && <span className="text-muted">{items}</span>}
    </div>
  );
};

export default Text;
