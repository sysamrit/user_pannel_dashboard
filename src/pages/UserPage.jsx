import React, { useEffect, useState } from 'react';
import "../style/userPage.css";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import LOGO from '../images/LOGO.png';

function UserPage() {
    const [insTableVisible, setInsTableVisible] = useState(false);
    const [isSeondaryTableVisible, setIsSeondaryTableVisible] = useState(false);
    const [scheduleTableVisible, setScheduleTableVisible] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [primaryInsTableData, setPrimaryInsTableData] = useState([]);
    const [secondaryInsTableData, setSecondaryInsTableData] = useState([]);
    const [scheduleTableData, setScheduleTableData] = useState([]); // Assuming this for the example
    const [toggleAPICall, setToggleAPICall] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedInputValue = localStorage.getItem('hrMantraId');
        console.log("Stored HR-MANTRA ID:", storedInputValue); // Log the stored value
        if (storedInputValue) {
            setInputValue(storedInputValue);
            fetchData(storedInputValue);
        }
    }, []);

    const handleTable = () => {
        if (inputValue) {
            localStorage.setItem('hrMantraId', inputValue);
            fetchData(inputValue);
        }
        setInsTableVisible(!insTableVisible);
        setScheduleTableVisible(!scheduleTableVisible);
        setIsSeondaryTableVisible(!isSeondaryTableVisible);
        setToggleAPICall(!toggleAPICall);
    };

    const fetchData = (id) => {
        axios
            .get(`${process.env.REACT_APP_BASE_URL2}/user/data/${id}`)
            .then((res) => {
                setPrimaryInsTableData(res.data.primary_inspection);
                setSecondaryInsTableData(res.data.secondry_inspection);
                // setScheduleTableData(res.data.schedule_inspection); // Assuming this for the example
            })
            .catch((err) => console.log(err));
    };

    const goToInspectionForm = (id, asset_id, asset_name, emp_id, emp_name, dept) => {
        navigate(`/inspection/form/${id}/${asset_id}/${asset_name}/${emp_id}/${emp_name}/${dept}`);
    };

    return (
        <>
            <div className="base_container">
                <div className="logo">
                    <img src={LOGO} alt="Amrit Cement Logo"></img>
                </div>
                <div className="input_field">
                    <input type='text' placeholder="Enter your HR-MANTRA id..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
                </div>
                <div className="btn_cls">
                    <button type='button' onClick={handleTable}>Search</button>
                </div>
                {insTableVisible && (
                    <div className="primary_table">
                        <div className="title_table"><p>Primary Inspection :</p></div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Asset Code</th>
                                    <th>Asset Name</th>
                                    <th>Section</th>
                                    <th>Button</th>
                                </tr>
                            </thead>
                            <tbody>
                                {primaryInsTableData.length > 0 ? (
                                    primaryInsTableData.map((ele, index) => (
                                        <tr key={index}>
                                            <td style={{ border: "1px solid #ccc", padding: "8px" }}>{ele.asset_id}</td>
                                            <td style={{ border: "1px solid #ccc", padding: "8px" }}>{ele.asset_name}</td>
                                            <td style={{ border: "1px solid #ccc", padding: "8px" }}>{ele.section_name}</td>
                                            <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                                                {ele.status === "Ongoing" ? (
                                                    <button onClick={() => goToInspectionForm(ele.scheduler_id, ele.asset_id, ele.asset_name, ele.emp_hrmantra_id, ele.emp_name, ele.dept_name)}>Start</button>
                                                ) : (
                                                    <label style={{ color: 'green' }}>Done</label>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="no-data">Haven't any Inspection Today</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
                {isSeondaryTableVisible && (
                    <div className="scondary_table">
                        <div className="title_table"><p>Secondary Inspection :</p></div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Asset Code</th>
                                    <th>Asset Name</th>
                                    <th>Section</th>
                                    <th>Button</th>
                                </tr>
                            </thead>
                            <tbody>
                                {secondaryInsTableData.length > 0 ? (
                                    secondaryInsTableData.map((ele, index) => (
                                        <tr key={index}>
                                            <td style={{ border: "1px solid #ccc", padding: "8px" }}>{ele.asset_id}</td>
                                            <td style={{ border: "1px solid #ccc", padding: "8px" }}>{ele.asset_name}</td>
                                            <td style={{ border: "1px solid #ccc", padding: "8px" }}>{ele.section_name}</td>
                                            <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                                            {ele.status === "Ongoing" ? (
                                                <button onClick={() => goToInspectionForm(ele.scheduler_id, ele.asset_id, ele.asset_name, ele.emp_hrmantra_id, ele.emp_name, ele.dept_name)}>Start</button>
                                            ) : (
                                                <label style={{ color: 'green' }}>Done</label>
                                            )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="no-data">Haven't any Inspection Today</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
                {scheduleTableVisible && (
                    <div className="schedule_table">
                        <div className="title_table"><p>Schedule Maintenance :</p></div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Sl No.</th>
                                    <th>Asset Id</th>
                                    <th>Last Service Date</th>
                                    <th>Next Service Date</th>
                                    <th>Button</th>
                                </tr>
                            </thead>
                            <tbody>
                                {scheduleTableData.length > 0 ? (
                                    scheduleTableData.map((ele, index) => (
                                        <tr key={index}>
                                            <td style={{ border: "1px solid #ccc", padding: "8px" }}>{index + 1}</td>
                                            <td style={{ border: "1px solid #ccc", padding: "8px" }}>{ele.asset_id}</td>
                                            <td style={{ border: "1px solid #ccc", padding: "8px" }}>{ele.last_service_date}</td>
                                            <td style={{ border: "1px solid #ccc", padding: "8px" }}>{ele.next_service_date}</td>
                                            <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                                                <button>Start</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="no-data">Haven't any Inspection Today</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}

export default UserPage;
