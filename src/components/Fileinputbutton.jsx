import React, { useRef } from "react";
import "../style/fileinputbtn.css";

function Fileinputbutton({ fieldName, text, index_no, inputFileUpdate,name }) {
  const fileInputRef = useRef(null);
  const buttonRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleOnChange = (e) => {
    buttonRef.current.style.backgroundColor = "green";
    buttonRef.current.innerText = "Selected";
    // inputFileUpdate(e.target.value, index_no);
  };

  return (
    <div className="file-input-container">
      <button className="file-input-button" type="button" onClick={handleButtonClick} ref={buttonRef}>
        File
      </button>
      <input
        type="file"
        className="file-input"
        ref={fileInputRef}
        name={name}
        onChange={handleOnChange}
        value={text}
        required
      />
    </div>
  );
}

export default Fileinputbutton;
