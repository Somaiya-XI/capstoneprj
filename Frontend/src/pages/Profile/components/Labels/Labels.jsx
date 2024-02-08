import "./Labels.css";
import { useState } from "react";

const Labels = ({ label1, label2, ltype }) => {
  const [flag, setFlag] = useState(1);

  return (
    <>
      <div className="name-container">
        <label className="company-info" id="f-label">
          {label1}
        </label>
        {flag === 1 ? (
          <>
            <label className="company-info" id="s-label">
              {label2}
            </label>
            <div className="bt2-container">
              <button
                type="button"
                onClick={() => setFlag(2)}
                className="btn btn-success bt2"
              >
                Change
              </button>
            </div>
          </>
        ) : (
          <>
            <input type={ltype} className="company-info" id="input2" />
            <div className="bt2-container">
              <button
                type="button"
                onClick={() => setFlag(1)}
                className="btn btn-success bt2"
              >
                Confirm
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Labels;
