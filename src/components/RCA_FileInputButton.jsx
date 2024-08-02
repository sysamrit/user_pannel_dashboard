import React, { useRef } from 'react'

function RCA_FileInputButton({fieldName}) {
    const fileInputRef = useRef(null);
    const buttonRef = useRef(null);

    const handleButtonClick = () => {
      fileInputRef.current.click();
    };
    const handleOnchange=()=>{
      buttonRef.current.style.backgroundColor="green";
      buttonRef.current.innerText="Selected";
    }
  return (
    <div className="file-input-container">
    <button className="file-input-button" onClick={handleButtonClick} ref={buttonRef}>
      Select File
    </button>
    <input
      type="file"
      className="file-input"
      ref={fileInputRef}
      name={fieldName}
      onChange={handleOnchange}
    />
  </div>
  )
}

export default RCA_FileInputButton