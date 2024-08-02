import React, { useEffect, useRef, useState } from "react";
import CheckPoint from "../components/CheckPoint";
import axios from "axios";
import SignatureCanvas from "react-signature-canvas";
import { useNavigate } from "react-router-dom";

function InspectionForm() {
  // .....................This portion use for Inspection ID and Name fields......................
  const [inspectors, setInspectors] = useState([]);
  const [asset, setAsset] = useState([]);
  const [selectedAssetNumber, setSelectedAssetNumber] = useState("");
  const [deptForm, setDeptForm] = useState([]);
  const [formName, setFormName] = useState([]);
  const [formFields, setFormFields] = useState([]);
  const [signature, setSignature] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = () => {
      axios
        .get(`${process.env.REACT_APP_BASE_URL2}/worker`)
        .then((res) => {
          setInspectors(res.data);
        })
        .catch((err) => console.log(err));
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchAsset = () => {
      axios
        .get(`${process.env.REACT_APP_BASE_URL2}/asset/codeandnames`)
        .then((res) => {
          setAsset(res.data);
        })
        .catch((err) => console.log(err));
    };
    fetchAsset();
  }, []);

  const handleAssetChange = (e) => {
    setSelectedAssetNumber(e.target.value.split("-")[0]);
  };

  useEffect(() => {
    const fetchDept = () => {
      if (selectedAssetNumber) {
        axios
          .get(
            `${process.env.REACT_APP_BASE_URL2}/form/asset/formnames/${selectedAssetNumber}`
          )
          .then((res) => {
            setDeptForm(res.data);
          })
          .catch((err) => console.log(err));
      }
    };
    fetchDept();
  }, [selectedAssetNumber]);

  const handleFormName = (e) => {
    setFormName(e.target.value);
  };

  useEffect(() => {
    const fetchFormField = () => {
      axios
        .get(`${process.env.REACT_APP_BASE_URL2}/form/name/${formName}`)
        .then((res) => {
          setFormFields(res.data[0].fields);
        })
        .catch((err) => console.log(err));
    };
    fetchFormField();
  }, [formName]);

  const clearHandler = (e) => {
    e.preventDefault();
    if (signature) {
      signature.clear();
    }
  };

  const responeUrl = `${process.env.REACT_APP_BASE_URL2}/inspection/sendresponse/`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    if (signature) {
      const signatureDataUrl = signature
        .getTrimmedCanvas()
        .toDataURL("image/png");
      const blob = await (await fetch(signatureDataUrl)).blob();
      formData.append("signature", blob, "signature.png");
    }
    const formObj = Object.fromEntries(formData);
    console.log(formObj);
    axios.post(responeUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }).then(response => {
      // console.log("Form submitted successfully:", response.data);
      if(response.data.status==="Saved"){
        alert("Your response saved");
        navigate('/inspection/inspection_report');
      }
    }).catch(error => {
      console.error("Error submitting form:", error);
    });
  };

  // upload photoes


  return (
    <div className="container2" style={{ position: "relative" }}>
      <h1>Inspection Form</h1>
      <form method="POST" onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <label htmlFor="ip-name">Inspector Id and Name:</label>
          <div className="search-fields">
            <input
              type="text"
              list="inspection_list"
              name="inspector_details"
              required
            />
            <datalist id="inspection_list">
              {inspectors.map((inspector, index) => (
                <option
                  key={index}
                  value={`${inspector.emp_hrmantra_id} - ${inspector.emp_name}`}
                >
                  {`${inspector.emp_hrmantra_id} - ${inspector.emp_name}`}
                </option>
              ))}
            </datalist>
          </div>
        </div>
        <div className="form-group">
          <label>Select Asset:</label>
          <div className="search-fields">
            <input
              type="text"
              list="asset_list"
              name="asset_details"
              onChange={handleAssetChange}
              required
            />
            <datalist id="asset_list">
              {asset &&
                asset.map((item, index) => (
                  <option
                    key={index}
                    value={`${item.asset_number} - ${item.asset_name}`}
                  >
                    {`${item.asset_number} - ${item.asset_name}`}
                  </option>
                ))}
            </datalist>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="department">Select Inspection Form:</label>
          <div className="search-fields">
            <input
              type="text"
              list="dept_list"
              onChange={handleFormName}
              required
            />
            <datalist id="dept_list">
              {deptForm.map((form, index) => (
                <option key={index} value={form}>
                  {form}
                </option>
              ))}
            </datalist>
          </div>
        </div>
        <div id="checkPoint-div">
          <CheckPoint data={formFields} />
        </div>
        <div
          className="photo_upload_container"
          style={{ margin: "auto", textAlign: "center" }}
          id="photo_upload_container"
        >
          {/* <div
            style={{
              display: "block",
              position: "absolute",
              top: "46%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 3,
              border: "1px solid #ccc",
              backgroundColor: "#EAEDED",
              
              height: "28vh",
              width: "70%",
            }}
            id="file_uploader_container"
            > */}
            <label >Upload Images:</label>
            <div
              className="input-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gridGap: "10px",
                marginTop: "30px",
                marginLeft: "70px",
              }}
            >
              <input type="file" name="photo_1" id="photo_1" />
              <input type="file" name="photo_2" id="photo_2" />
              <input type="file" name="photo_3" id="photo_3" />
              <input type="file" name="photo_4" id="photo_4" />
              <input type="file" name="photo_5" id="photo_5" />
              <input type="file" name="photo_6" id="photo_6" />
              <input type="file" name="photo_7" id="photo_7" />
              <input type="file" name="photo_8" id="photo_8" />
            </div>
            {/* <button
                type="button"
                onClick={hideFileContainer}
                style={{
                  width: "50%",
                  paddingTop: "5px",
                  backgroundColor: "#F1948A",
                  marginTop: "8px",
                }}
              >
                Close
              </button> */}
          {/* </div> */}
        </div>
        <div className="form-group2" style={{paddingTop:"30px",marginBottom:"15px"}}>
          <label>Asset Status:</label>
          <div className="asset-status-buttons">
            <select name="asset_status" id="ip-name" required>
              <option value="">Select Option</option>
              <option value="Available">Available</option>
              <option value="Not Available">Not Available</option>
              <option value="Scrapped">Scrapped</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="asset_safe_to_use">Asset Safe to Use:</label>
          <div className="asset-safe-buttons">
            <select id="asset_safe_to_use" name="asset_safe_to_use" required>
              <option value="">Select Option</option>
              <option value="YES">YES</option>
              <option value="NO">NO</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="deployed">Deployed:</label>
          <div className="asset-deployed-buttons">
            <select name="deployed" id="deployed" required>
              <option value="">Select Option</option>
              <option value="YES">YES</option>
              <option value="NO">NO</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="additional-comments">Additional Comments:</label>
          <textarea
            id="additional-comments"
            rows="4"
            placeholder="Enter any additional comments"
            name="notes"
          ></textarea>
        </div>
        <div className="form-group">
          <label>Signature:</label>
          <div
            style={{
              width: 400,
              height: 150,
              border: "1px solid #ccc",
              boxShadow:
                "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
            }}
          >
            <SignatureCanvas
              ref={(ref) => {
                setSignature(ref);
              }}
              penColor="black"
              canvasProps={{ width: 400, height: 150, className: "sigCanvas" }}
            />
          </div>
          <button
            onClick={clearHandler}
            style={{ width: 100, height: 30, backgroundColor: "#F5B7B1",fontWeight:"bold" }}
          >
            Clear
          </button>
        </div>
        <div className="insp-btn-div">
          <button
            className="submit-btn"
            type="submit"
            style={{
              boxShadow:
                "rgba(136, 165, 191, 0.48) 6px 2px 16px 0px, rgba(255, 255, 255, 0.8) -6px -2px 16px 0px",
            }}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default InspectionForm;
