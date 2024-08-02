import { useState } from "react";
import "../App.css";
import Fileinputbutton from "./Fileinputbutton";

function SingleCheckPoint({ ques, ele_number }) {
  const [selectedValue, setSelectedValue] = useState("");
  const [fileUploads, setFileUploads] = useState([""]);

  const handleSingleCheckpointOnChange = (val) => {
    setSelectedValue(val);
    if (val === "NOT OK") {
      setFileUploads([""]);
    } else {
      setFileUploads([]);
    }
  };

  const addFile = () => {
    setFileUploads([...fileUploads, ""]);
  };

  const updateFileUpload = (content, index) => {
    const newFileUploads = [...fileUploads];
    newFileUploads[index] = content;
    setFileUploads(newFileUploads);
  };

  const handleClickCancel = () => {
    setFileUploads([]);
  };

  return (
    <div className="checkPoint-container">
      <label className="chekpoint-lbl text-center">{ques}</label>
      <div className="asset-status-buttons">
        <div className="btn-con">
          <input
            type="radio"
            value="OK"
            name={"CK_" + ques}
            id={ele_number + "ok_check"}
            required
            onChange={(e) => handleSingleCheckpointOnChange(e.target.value)}
          />
          <label className="custom-radio" htmlFor={ele_number + "ok_check"}>
            OK
          </label>
        </div>

        <div className="btn-con">
          <input
            type="radio"
            value="NOT OK"
            name={"CK_" + ques}
            id={ele_number + "not_ok_check"}
            required
            onChange={(e) => handleSingleCheckpointOnChange(e.target.value)}
          />
          <label className="custom-radio" htmlFor={ele_number + "not_ok_check"}>
            NOT OK
          </label>
        </div>

        <div className="btn-con">
          <input
            type="radio"
            value="NA"
            name={"CK_" + ques}
            id={ele_number + "na_check"}
            required
            onChange={(e) => handleSingleCheckpointOnChange(e.target.value)}
          />
          <label className="custom-radio" htmlFor={ele_number + "na_check"}>
            NA
          </label>
        </div>
      </div>
     
      {selectedValue === "NOT OK" && (
        <div className="file-upload-section">
          <div className="inputFileButton">
            {fileUploads.map((ele, indx) => (
              <Fileinputbutton
                key={indx}
                index_no={indx}
                value={ele}
                inputFileUpdate={updateFileUpload}
                name={`CK_${ques.replaceAll(" ","_")}_photo_${indx + 1}`}
              />
            ))}
          </div>
          <div className="add_btn">
            <button type="button" onClick={addFile} style={{ backgroundColor: "green" }}>
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SingleCheckPoint;
