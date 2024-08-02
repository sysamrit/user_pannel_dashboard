import React, { useEffect, useState } from 'react';
import { RiCloseLargeFill } from 'react-icons/ri';
import '../style/scheduleForm.css';
import { TbPlaylistAdd } from 'react-icons/tb';
import SingleInputAdd from './SingleInputAdd';
import SchedulePart from './SchedulePart';
import { BiAddToQueue } from 'react-icons/bi';
import axios from 'axios';

function SchedulesCreateForm({ toggleContainer }) {
    const [addTask, setAddTask] = useState(['']);
    const [currectivePart, setCurrectivePart] = useState([{ material: '', qty: '' }]);
    const [assetData, setAssetData] = useState([]);
    const [empData, setEmpData] = useState([]);
    const [assetNumber, setAssetNumber] = useState('');
    const [assetName, setAssetName] = useState('');
    const [intervalType, setIntervalType] = useState('number'); 

    const addTaskFields = () => {
        setAddTask([...addTask, '']);
    };

    const updateTask = (content, index) => {
        const updatedTasks = [...addTask];
        updatedTasks[index] = content;
        setAddTask(updatedTasks);
    };

    const addCurrectivePart = () => {
        setCurrectivePart([...currectivePart,{ material: '', qty: '' }]);
    };

    const updateCurrectivePart = (content, index, key) => {
        const updatedParts = [...currectivePart];
        updatedParts[index] = {...updatedParts[index],[key]: content};
        setCurrectivePart(updatedParts);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if(addTask.length !== currectivePart.length){
            alert("Task length and part length miss matched");
            return;
        }
        const formData = new FormData(e.target);
        const formObj = Object.fromEntries(formData.entries());
        const task_data=currectivePart.map((ele,index)=>{
            ele["task"]=addTask[index];
            return ele;
        })
        console.log(task_data);
        

        // formObj['part_data']=currectivePart;

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
        <>
            <div className="view_container">
                <div>
                    <h4 className="heading_contant">Create Schedule</h4>
                    <hr className="header-line" />
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="schedule_create_container">
                        <div className="sub_div">
                            <div className="form_container">
                                <div className="form_item">
                                    <label htmlFor="link_workorder">Schedule Category</label>
                                    <select name='category' required>
                                        <option>Select Category</option>
                                        <option>Maintenance Schedule</option>
                                        <option>EHS Schedule</option>
                                        <option>Lubrication Schedule</option>
                                    </select>
                                </div>
                                <div className="form_item">
                                    <label>Schedule Title</label>
                                    <input type="text" id="schedule_title" name='title' required />
                                </div>
                                <div className="form_item">
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
                                <div className="form_item">
                                    <label>Asset Name</label>
                                    <input type="text" id="asset_name" name='asset_name' value={assetName} required />
                                </div>
                                <div className="form_item">
                                    <label>Last Service Date</label>
                                    <input type="date" name='last_service_date' required />
                                </div>
                                <div className="form_item">
                                    <label>Repeat Type</label>
                                    <input type="text" value="Hour" readOnly />
                                </div>
                                <div className="form_item">
                                    <label>Interval Type</label>
                                    <div>
                                        <label>
                                            <input type="radio" name="intervalType" value="number" checked={intervalType === 'number'} onChange={() => setIntervalType('number')} />
                                            Hour
                                        </label>
                                        <label>
                                            <input type="radio" name="intervalType" value="number" checked={intervalType === 'number'} onChange={() => setIntervalType('number')} />
                                            Day
                                        </label>
                                    </div>
                                </div>
                                <div className="form_item">
                                    <label>Interval</label>
                                    {intervalType === 'number' ? (
                                        <input type="number" id="interval" name='interval' required />
                                    ) : (
                                        <input type="number" id="intervalDay" name='intervalDay' required />
                                    )}
                                </div>
                                <div className="form_item">
                                    <label>Primary</label>
                                    <input type="text" id="primary" name='primary_rem' list='primary_rem' />
                                    <datalist id="primary_rem">
                                        {empData.map((empdata, index) => (
                                            <option key={index} value={`${empdata.emp_hrmantra_id} - ${empdata.emp_name} - ${empdata.dept_name}`}>
                                                {`${empdata.emp_hrmantra_id} - ${empdata.emp_name} - ${empdata.dept_name}`}
                                            </option>
                                        ))}
                                    </datalist>
                                </div>
                                <div className="form_item">
                                    <label>Secondary</label>
                                    <input type="text" id="secondary" name='secondary_rem' list='secondary_rem' />
                                    <datalist id="secondary_rem">
                                        {empData.map((empdata, index) => (
                                            <option key={index} value={`${empdata.emp_hrmantra_id} - ${empdata.emp_name} - ${empdata.dept_name}`}>
                                                {`${empdata.emp_hrmantra_id} - ${empdata.emp_name} - ${empdata.dept_name}`}
                                            </option>
                                        ))}
                                    </datalist>
                                </div>
                                <div className="form_item">
                                    <label>Third</label>
                                    <input type="text" id="Third" name='third_rem' list='third_rem' />
                                    <datalist id="third_rem">
                                        {empData.map((empdata, index) => (
                                            <option key={index} value={`${empdata.emp_hrmantra_id} - ${empdata.emp_name} - ${empdata.dept_name}`}>
                                                {`${empdata.emp_hrmantra_id} - ${empdata.emp_name} - ${empdata.dept_name}`}
                                            </option>
                                        ))}
                                    </datalist>
                                </div>
                                <div className="form_item">
                                    <label>Note</label>
                                    <textarea id="additional-comments" rows="4" placeholder="Enter any additional comments" name="notes"></textarea>
                                </div>
                                <div className="taskInputSection">
                                    <div>
                                        <h5 style={{ textAlign: "center", fontWeight: 500 }}>Task</h5>
                                        <hr className="header-line" />
                                    </div>
                                    <div className="task_table">
                                        {addTask && addTask.map((ele, indx) => (
                                            <SingleInputAdd taskUpdate={updateTask} key={indx} index_no={indx} data={ele} />
                                        ))}
                                        <div className="button_container">
                                            <button onClick={addTaskFields} type="button">
                                                <TbPlaylistAdd className="icon_observ" />Add Task
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="currective_Action_section">
                                    <div style={{ textAlign: "center", fontWeight: 500 }}>
                                        <h5>Part</h5>
                                        <hr className="header-line" />
                                    </div>
                                    <div className="currective_action">
                                        {currectivePart && currectivePart.map((ele, index) => (
                                            <SchedulePart update_Currective_Part={updateCurrectivePart} key={index} index_no={index} value={ele} />
                                        ))}
                                        <div className="curr_part_btn">
                                            <button type="button" onClick={addCurrectivePart}>
                                                <TbPlaylistAdd className="icon_corrective" />Add Part
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="RCA_button_container" style={{ display: "flex", justifyContent: "space-between" }}>
                        <button type="submit" className="submit_btn">
                            <BiAddToQueue className="icon_create" />
                            Create Schedule
                        </button>
                        <button className="close_btn" type="button" onClick={toggleContainer}>
                            <RiCloseLargeFill className="icon" />
                            Close
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default SchedulesCreateForm;
