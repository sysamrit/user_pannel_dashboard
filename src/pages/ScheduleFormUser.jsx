import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../style/userScheduleForm.css";

function ScheduleFormUser({ toggleContainer }) {
    const [addTask, setAddTask] = useState(['']);
    const [currectivePart, setCurrectivePart] = useState([{ material: '', qty: '' }]);
    const [assetData, setAssetData] = useState([]);
    const [empData, setEmpData] = useState([]);
    const [assetNumber, setAssetNumber] = useState('');
    const [assetName, setAssetName] = useState('');


    const handleSubmit = (e) => {
        e.preventDefault();
        if (addTask.length !== currectivePart.length) {
            alert("Task length and part length mismatch");
            return;
        }
        const formData = new FormData(e.target);
        const formObj = Object.fromEntries(formData.entries());
        const task_data = currectivePart.map((ele, index) => {
            ele["task"] = addTask[index];
            return ele;
        });
        console.log(task_data);
        console.log(formObj);
    };

    useEffect(() => {
        const fetchData = () => {
            axios.get(`${process.env.REACT_APP_BASE_URL2}/asset/codeandnames`)
                .then((res) => {
                    setAssetData(res.data);
                })
                .catch((err) => console.log(err));
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchEmpData = () => {
            axios.get(`${process.env.REACT_APP_BASE_URL2}/worker`)
                .then((res) => {
                    setEmpData(res.data);
                })
                .catch((err) => console.log(err));
        };
        fetchEmpData();
    }, []);

    return (
        <div className="schedule-form-container">
            <div className="form-header">
                <h4> Schedule</h4>
                <hr className="header-line" />
                </div>
            <form onSubmit={handleSubmit}>
                <div className="form-group1">
                    <label htmlFor="link_workorder">Schedule Category</label>
                    <select name='category' required>
                        <option value="">Select Category</option>
                        <option>Maintenance Schedule</option>
                        <option>EHS Schedule</option>
                        <option>Lubrication Schedule</option>
                    </select>
                </div>
                <div className="form-group1">
                    <label>Schedule Title</label>
                    <input type="text" id="schedule_title" name='title' required />
                </div>
                <div className="form-group1">
                    <label>Asset Number</label>
                    <input type="text" id="asset_number" name="asset_number" list='assetNumber' value={assetNumber} onChange={(e) => { setAssetNumber(e.target.value.split(" - ")[0]); setAssetName(e.target.value.split(" - ")[1]) }} required />
                    <datalist id="assetNumber">
                        {assetData.map((assetdata, index) => (
                            <option key={index} value={`${assetdata.asset_number} - ${assetdata.asset_name}`}>
                                {`${assetdata.asset_number} - ${assetdata.asset_name}`}
                            </option>
                        ))}
                    </datalist>
                </div>
                <div className="form-group1">
                    <label>Asset Name</label>
                    <input type="text" id="asset_name" name='asset_name' value={assetName} required />
                </div>
                <div className="form-group1">
                    <label>Last Service Date</label>
                    <input type="date" name='last_service_date' required />
                </div>
               
                <div className="task_table">
                        <div className="title">Task Data</div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Task</th>
                                    <th>Material</th>
                                    <th>Qty</th>
                                </tr>
                            </thead>
                            <tbody>
                      {/* {primaryInsTableData && primaryInsTableData.map((ele,index)=>{
                       return <tr key={index}>
                        <td style={{ border: "1px solid #ccc", padding: "8px" }}>{ele.asset_id}</td>
                        <td style={{ border: "1px solid #ccc", padding: "8px" }}>{ele.asset_name}</td>
                        <td style={{ border: "1px solid #ccc", padding: "8px" }}>{ele.section_name}</td>
                        <td style={{ border: "1px solid #ccc", padding: "8px" }}>{ele.status==="Ongoing"?<button onClick={()=>goToInspectionForm(ele.scheduler_id,ele.asset_id,ele.asset_name,ele.emp_hrmantra_id,ele.emp_name,ele.dept_name)}>Start</button>:<label style={{colors:'green'}}>Done</label>}</td>

                        </tr>
                      })} */}
                      <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        </tr>
                            </tbody>

                        </table>
                    </div>
                <div className="form-group1 text-center mt-4">
                    <button type="submit" className="btn-submit">Submit</button>
                </div>
            </form>
        </div>
    );
}

export default ScheduleFormUser;
