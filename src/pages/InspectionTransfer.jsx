import React, { useEffect, useState } from 'react';
import "../style/inspectionTransfer.css";
import axios from "axios";
import { TiExportOutline } from 'react-icons/ti';


function InspectionTransfer() {
    const [selectDepartment, setSelectDepartment] = useState([]);
    const [deptName, setDeptName] = useState("");
    const [inspectorData, setInspectorData] = useState([]);
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [previousInspection, setPreviousInspection] = useState("");
    const [newInspection, setNewInspection] = useState("");

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
        
    };


      //.................. Authentication Portion.......................

   const handleAuthentication=()=>{
    const hrmantraId = window.prompt("Enter your ID:");
        if (hrmantraId !== null) {
          const password = window.prompt("Enter your password:");
          if (password !== null) {
            const dept=deptName.toLowerCase();
            console.log(dept);

      axios.post(`${process.env.REACT_APP_BASE_URL2}/assignwork/hod/access`,{department:dept,id:hrmantraId,password},{
      headers:{"Content-Type":"application/json"}
          })
        .then((res)=>{
            if(res.status===200){
              axios
                  .put(`${process.env.REACT_APP_BASE_URL2}/inspection/transfer/`,{deptName,startTime,endTime,previousInspection,newInspection})
                  .then((res) => {
                      console.log(res.data);
                    if(res.data==="DONE"){
                      alert("Transfer Done");
                        setNewInspection("");
                        setPreviousInspection("");
                    }
                  })
                  .catch((err) => console.log(err));
            }
        })
        .catch((errRES)=>{
            alert(errRES.response.data);
            return;
        })
   }
  }
}

    return (
        <div className="transfer-form-container">
            <div className="form-header">
                <h4>Temporary Inspection Transfer</h4>
                <hr className="header-line" />
            </div>
            <form onSubmit={handleSubmit}>
                <div className="form-group1">
                    <label htmlFor="dept">Department</label>
                    <input type="text" id="dept" name="dept_name" list='dept_list' value={deptName} onChange={(e)=>setDeptName(e.target.value)} required />
                    <datalist id="dept_list">
                        {selectDepartment &&
                         selectDepartment.map((item, index) => (
                         <option key={index} value={`${item}`}>
                            {`${item}`}
                         </option>
                         ))}
                   </datalist>
                </div>
                <div className='calender_section'>
                        <div className="cal_input">
                            <label htmlFor='start_date'>Form Date</label>
                            <input type="date" id="start_date" value={startTime} onChange={(e)=>setStartTime(e.target.value)}  />
                        </div>
                        <div className="cal_input">
                            <label htmlFor='end_date'>To Date</label>
                             <input type="date" id="end_date" name='end_date' value={endTime} onChange={(e)=>setEndTime(e.target.value)} />

                        </div>

                </div>
                <div className="inspector-row">
                    <div className="inspector-input-group">
                        <label htmlFor="pre_inspector">Previous Inspector</label>
                        <input type="text" id="pre_inspector" name="pre_inspector" value={previousInspection} list='pre_inspector_list' onChange={(e)=>setPreviousInspection(e.target.value)} required />
                     <datalist id="pre_inspector_list">
                        {inspectorData &&
                         inspectorData.map((item, index) => (
                         <option key={index} value={`${item.emp_hrmantra_id} - ${item.emp_name} - ${item.dept_name}`}>
                            {`${item.emp_hrmantra_id} - ${item.emp_name} - ${item.dept_name}`}
                         </option>
                        ))}
                     </datalist>
                    </div>
                    <button className="transfer-button" type='button' style={{width:"20%"}} onClick={handleAuthentication}>Transfer  <TiExportOutline style={{fontSize:"20px"}}/></button>
                    <div className="inspector-input-group">
                        <label htmlFor="new_inspector">New Inspector</label>
                        <input type="text" id="new_inspector" name="new_inspector" list='new_inspector_list' value={newInspection} onChange={(e)=>setNewInspection(e.target.value)} required />
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
