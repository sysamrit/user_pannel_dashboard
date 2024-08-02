import React, { useState,useEffect } from "react";
import "../style/inspectionform.css";
import axios from "axios";
import CheckPoint from "../components/CheckPoint";
import Fileinputbutton from "../components/Fileinputbutton";
import SignatureCanvas from "react-signature-canvas";
import { useNavigate, useParams } from "react-router-dom";
import { Commet } from "react-loading-indicators"; // Corrected import


function InspectionForm() {
  const { id,asset_id,asset_name } = useParams(); //extract id from the url
  const [inspectors, setInspectors] = useState([]);
  const [myAsset, setMyAsset] = useState("");
  const [inspectionScheduleID, setInspectionScheduleID] = useState();
  const [selectedAssetNumber, setSelectedAssetNumber] = useState("");
  const [isDeptSectionVisible, setIsDeptSectionVisible] = useState(false);
  const [splitDepartment, setSplitDepartment] = useState("");
  const [deptList, setDeptList] = useState([]);
  const [asset, setAsset] = useState([]);
  const [formName, setFormName] = useState([]);
  const [deptForm, setDeptForm] = useState([]);
  const [formFields, setFormFields] = useState([]);
  const [signature, setSignature] = useState();
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();
  
  const [coordinates, setCoordinates] = useState({
    latitude: null,
    longitude: null,
  });

  useEffect(() => {
    if (id) {
      setInspectionScheduleID(id); 
    }
    
  }, [id]);
  useEffect(() => {
    if (asset_id && asset_name) {
      setMyAsset(`${asset_id} - ${asset_name}`); 
    }
    
  }, [asset_id,asset_name]);
  useEffect(() => {
    handleAssetChange(myAsset.split(" - ")[0])
  }, [myAsset]);


  useEffect(() => {
    const fetchData = () => {
      axios
        .get(`${process.env.REACT_APP_BASE_URL2}/worker`)
        .then((res) => {
          console.log("Data :",res.data);
          setInspectors(res.data);
        })
        .catch((err) => console.log(err));
    };

    fetchData();
  }, []);
  
  useEffect(()=>{
    const fetchDept=()=>{
      axios.get(`${process.env.REACT_APP_BASE_URL2}/general/dept`)
      .then((res)=>{
        setDeptList(res.data);
      })
      .catch((err)=>console.log(err));
    }
    fetchDept();
  },[]);


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

  useEffect(() => {
    const fetchDept = () => {
      if (selectedAssetNumber) {
        axios
          .get(
            `${process.env.REACT_APP_BASE_URL2}/form/asset/formnames/${selectedAssetNumber}`
          )
          .then((res) => {
            console.log(res.data);
            setDeptForm(res.data);
          })
          .catch((err) => console.log(err));
      }
    };
    fetchDept();
  }, [selectedAssetNumber]);

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

  const responeUrl = `${process.env.REACT_APP_BASE_URL2}/inspection/sendresponse/`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    // Clear previous coordinates and error state
    setCoordinates({ latitude: null, longitude: null });

    // Get geolocation
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const newCoordinates = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };

          const formData = new FormData(e.target);

          if (signature) {
            const signatureDataUrl = signature
              .getTrimmedCanvas()
              .toDataURL("image/png");
            const blob = await (await fetch(signatureDataUrl)).blob();
            formData.append("signature", blob, "signature.png");
          }

          formData.append(
            "coordinates",
            newCoordinates["latitude"] + "," + newCoordinates["longitude"]
          );

          console.log(Object.fromEntries(formData));

          axios
            .post(responeUrl, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then((response) => {
              if (response.data.status === "Saved") {
                alert("Your response has been saved");
                navigate("/user");
              }
            })
            .catch((error) => {
              console.error("Error submitting form:", error);
            })
            .finally(() => {
              setLoading(false); // Stop loading
            });
        },
        async(err) => {
          const formData = new FormData(e.target);

          if (signature) {
            const signatureDataUrl = signature
              .getTrimmedCanvas()
              .toDataURL("image/png");
            const blob = await (await fetch(signatureDataUrl)).blob();
            formData.append("signature", blob, "signature.png");
          }

          formData.append(
            "coordinates",
            '00'+ "," + '00'
          );

          console.log(Object.fromEntries(formData));

          axios
            .post(responeUrl, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then((response) => {
              if (response.data.status === "Saved") {
                alert("Your response has been saved");
                navigate("/user");
                window.close();
                window.top.close();
              }
            })
            .catch((error) => {
              console.error("Error submitting form:", error);
            })
            .finally(() => {
              setLoading(false); // Stop loading
            });
          // alert(
          //   err["message"] +
          //     ", please allow the location capture and reload the page"
          // );
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      alert("Geolocation not available in this device");
    }
  };




  const handleAssetChange = (e) => {
    setMyAsset(e);
    setSelectedAssetNumber(e.split("-")[0]);
  };
  const handleFormName = (e) => {
    setFormName(e.target.value);
  };
  const clearHandler = (e) => {
    e.preventDefault();
    if (signature) {
      signature.clear();
    }
  };

   const assignDeptSection=()=>{
      
    setIsDeptSectionVisible(!isDeptSectionVisible);
   }

   const handelDeptName=(e)=>{
    setSplitDepartment(e.target.value.split(" - ")[2]);
     
   }


  return (
    <form onSubmit={handleSubmit}>
      <div className="inspection-form-container">
        <div className="form-header">
          <h5 style={{fontWeight:"600",color:"rgba(19, 17, 17, 0.637)"}}>Inspection Form</h5>
        </div>
        {loading && (
        <div className="loading-indicator-container">
          <Commet color="red" size="medium" text="" textColor="" />
        </div>
      )}
      <div className={`form-content ${loading ? "hidden" : ""}`}></div>

      <div className="form-group  mt-4">
          <label className="form-label text-start">Inspection Schedule ID</label>
          <div className="search-fields">
            <input type="text" className="form-control" value={inspectionScheduleID} name="schedulerid" readOnly/>
          </div>
      </div>
        <div className="form-group">
          <label className="form-label text-start" htmlFor="ip-name">
            Inspector Name
          </label>
          <div className="search-fields">
            <input
              type="text"
              list="inspection_list"
              name="inspector_details"
              className="form-control"
              onChange={handelDeptName}
              required
            />
            <datalist id="inspection_list">
              {inspectors.map((inspector, index) => (
                <option
                  key={index}
                  value={`${inspector.emp_hrmantra_id} - ${inspector.emp_name} - ${inspector.dept_name}`}
                >
                  {`${inspector.emp_hrmantra_id} - ${inspector.emp_name} - ${inspector.dept_name}`}
                </option>
              ))}
            </datalist>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label text-start">Department</label>
          <div className="search-fields">
            <input type="text" className="form-control" name="department" value={splitDepartment} readOnly />

            {/* <datalist id="dept_list">
              {deptList &&
                deptList.map((item, index) => (
                  <option
                    key={index}
                    value={`${item}`}
                  >
                    {`${item}`}
                  </option>
                ))}
            </datalist> */}
          </div>
      </div>
        <div className="form-group">
          <label className="form-label text-start">Asset</label>
          <div className="search-fields">
            <input type="text" list="asset_list" name="asset_details" value={myAsset} onChange={(e)=>{handleAssetChange(e.target.value)}}  className="form-control" required/>
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
          <label htmlFor="department" className="form-label text-start">
            Inspection Form
          </label>
          <div className="search-fields">
            <input
              type="text"
              list="dept_form_list"
              onChange={handleFormName}
              name="inspection_form_name"
              autoComplete="off"
              required
            />
            <datalist id="dept_form_list">
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

        <div className="form-group mt-4">
            <label className="text-start">Asset Status</label>
            <select name="asset_status" id="ip-name" className="form-select" required>
                <option value="">Select Option</option>
                <option value="Available">Available</option>
                <option value="Not Available">Not Available</option>
                <option value="Scrapped">Scrapped</option>
            </select>
        </div>

        <div className="form-group">
          <label htmlFor="asset_safe_to_use" className="text-start">Asset safe to use</label>
            <select id="asset_safe_to_use" name="asset_safe_to_use" className="form-select" required>
              <option value="">Select Option</option>
              <option value="YES">YES</option>
              <option value="NO">NO</option>
            </select>
        </div>

        <div className="form-group">
          <label htmlFor="deployed" className="text-start">Deployed</label>
            <select name="deployed" id="deployed" className="form-select" required>
              <option value="">Select Option</option>
              <option value="YES">YES</option>
              <option value="NO">NO</option>
            </select>
        </div>
        <div className="form-group">
          <label htmlFor="additional-comments" className="text-start">Additional Comments</label>
          <textarea
            id="additional-comments"
            rows="4"
            placeholder="Enter any additional comments"
            name="notes"
          ></textarea>
           <div className="text_area_btn">

           <button type="button" onClick={assignDeptSection}>Assign Other Department</button>
           </div>
        
          </div>
          {isDeptSectionVisible &&(
          <div className="assign_Dept_section">
         <div className="form-group2">
          <label className="form-label text-start">Department</label>
          <div className="datalist-fields">
             <input type="text" className="form-control" name="department_faulty" list="dept_faulty_list" required/>
             <datalist id="dept_faulty_list">
              {deptList &&
                deptList.map((item, index) => (
                  <option
                    key={index}
                    value={`${item}`}
                  >
                    {`${item}`}
                  </option>
                ))}
             </datalist>
            </div>
         </div>
         <div className="faulty_label">
         <label htmlFor="additional-comments" className="text-start">Add Faulty Details</label>
         </div>
         <div className="faulty_area">
          <textarea
            id="additional-comments"
            rows="4"
            placeholder="Enter faulty details"
            name="assign_additinal_note"
          ></textarea>
          </div>
      </div>
     )}
        <div className="form-group">
          <label>Signature</label>
          <div
            style={{
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
            style={{ width: 100, height: 50, backgroundColor: "#aeaeaee6",fontWeight:"bold" }}
          >
            Clear
          </button>
        </div>

        <div className="form-group text-center mt-4">
            <button type="submit" className="btn btn-denger submit_button" style={{width:"50%",boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",backgroundColor:"red",color:"white"}}>Sumbit</button>
        </div>
        <div className="mb-5"></div>
      </div>
    </form>
  );
}

export default InspectionForm;
