import React, { useEffect, useState } from 'react';
import "../style/inspectionTransfer.css";
import axios from "axios";
import { TiExportOutline } from 'react-icons/ti';


function InspectionTransfer() {
    const [selectDepartment, setSelectDepartment] = useState([]);
    const [inspectorData, setInspectorData] = useState([]);

    useEffect(()=>{
        const fetchDept=()=>{
          axios.get(`${process.env.REACT_APP_BASE_URL2}/general/dept`)
          .then((res)=>{
            // console.log(res.data);
            setSelectDepartment(res.data);
          })
          .catch((err)=>console.log(err));
        }
        fetchDept();
      },[]);


      useEffect(()=>{
        const fetchInsData=()=>{
            axios.get(`${process.env.REACT_APP_BASE_URL2}/worker`)
            .then((res)=>{
                setInspectorData(res.data);
            })
            .catch((err)=>console.log(err));
        }
        fetchInsData();
      },[]);


    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formObj = Object.fromEntries(formData.entries());
        console.log(formObj);
    };

    // const handelOnInput=(e)=>{
    // console.log(e);
    // }

    return (
        <div className="transfer-form-container">
            <div className="form-header">
                <h4>Inspection Transfer</h4>
                <hr className="header-line" />
            </div>
            <form onSubmit={handleSubmit}>
                <div className="form-group1">
                    <label htmlFor="dept">Department</label>
                    <input type="text" id="dept" name="dept_name" list='dept_list'  required />
                    <datalist id="dept_list">
                        {selectDepartment &&
                         selectDepartment.map((item, index) => (
                         <option key={index} value={`${item}`}>
                            {`${item}`}
                         </option>
                         ))}
                   </datalist>
                </div>
                <div className="inspector-row">
                    <div className="inspector-input-group">
                        <label htmlFor="pre_inspector">Previous Inspector</label>
                        <input type="text" id="pre_inspector" name="pre_inspector" list='pre_inspector_list' required />
                     <datalist id="pre_inspector_list">
                        {inspectorData &&
                         inspectorData.map((item, index) => (
                         <option key={index} value={`${item.emp_hrmantra_id} - ${item.emp_name} - ${item.dept_name}`}>
                            {`${item.emp_hrmantra_id} - ${item.emp_name} - ${item.dept_name}`}
                         </option>
                        ))}
                     </datalist>
                    </div>
                    <button className="transfer-button" style={{width:"20%"}}>Transfer  <TiExportOutline style={{fontSize:"20px"}}/></button>
                    <div className="inspector-input-group">
                        <label htmlFor="new_inspector">New Inspector</label>
                        <input type="text" id="new_inspector" name="new_inspector" list='new_inspector_list' required />
                        <datalist id="new_inspector_list">
                        {inspectorData &&
                         inspectorData.map((item, index) => (
                         <option key={index} value={`${item.emp_hrmantra_id} - ${item.emp_name} - ${item.dept_name}`}>
                            {`${item.emp_hrmantra_id} - ${item.emp_name} - ${item.dept_name}`}
                         </option>
                       ))}
                      </datalist>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default InspectionTransfer;
