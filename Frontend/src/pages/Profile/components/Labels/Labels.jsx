import "./Labels.css";

const Labels = ({ label1, label2 }) => {
  return (
    <>
      <div className="name-container">
        <label className="company-info" id="f-label">
          {label1}
        </label>
        <label className="company-info" id="s-label">
          {label2}
        </label>
        <div className="bt2-container">
          <button type="button" className="btn btn-success bt2">
            Change
          </button>
        </div>
      </div>
    </>
  );
};

export default Labels;
