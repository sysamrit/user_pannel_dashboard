import React, { useEffect, useState } from 'react';
import "../style/userPage.css";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import LOGO from '../images/LOGO.png';

function UserPage() {
    const [insTableVisible, setInsTableVisible] = useState(false);
    const [isSeondaryTableVisible, setIsSeondaryTableVisible] = useState(false);
    const [isOtherTableVisible, setIsOtherTableVisible] = useState(false);
    const [isAutomobileVisible, setIsAutomobileVisible] = useState(false);
    const [scheduleTableVisible, setScheduleTableVisible] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [primaryInsTableData, setPrimaryInsTableData] = useState([]);
    const [secondaryInsTableData, setSecondaryInsTableData] = useState([]);
    const [otherTableData, setOtherTableData] = useState([]);
    const [automobileTableData, setAutomobileTableData] = useState([]);
    const [autoMobileEmpData, setAutoMobileEmpData] = useState([]);
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
        setIsOtherTableVisible(!isOtherTableVisible);
        setIsAutomobileVisible(!isAutomobileVisible);
        setToggleAPICall(!toggleAPICall);
    };

    const fetchData = (id) => {
        axios
            .get(`${process.env.REACT_APP_BASE_URL2}/user/data/${id}`)
            .then((res) => {
                setPrimaryInsTableData(res.data.primary_inspection);
                setSecondaryInsTableData(res.data.secondry_inspection);
                setOtherTableData(res.data.otherworks);
                if(res.data.autmobile){
                    setAutomobileTableData(res.data.autmobile);
                    setAutoMobileEmpData(res.data.emp_data);
                    // console.log(res.data.emp_data);
                }

                // setScheduleTableData(res.data.schedule_inspection); // Assuming this for the example
            })
            .catch((err) => {
                if (err.code === 'ERR_NETWORK') {
                    alert('Please Connect with Network ..');
                } else {
                    console.log(err);
                }
            });
    };

    const goToInspectionForm = (id, asset_id, asset_name, emp_id, emp_name, dept) => {
        navigate(`/inspection/form/${id}/${asset_id}/${asset_name}/${emp_id}/${emp_name}/${dept}`);
    };

    const currentDate=new Date();
    // console.log(currentDate);

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
                                    <th>Status</th>
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
                                                {ele.to_date == null ?((ele.status === "Ongoing" ? (
                                                    <button onClick={() => goToInspectionForm(ele.scheduler_id, ele.asset_id, ele.asset_name, ele.emp_hrmantra_id, ele.emp_name, ele.dept_name)}>Start</button>
                                                ) : (
                                                    <label style={{ color: 'green' }}>Done</label>
                                                ))):(new Date(ele.from_date)<=new Date() && new Date()<=new Date(ele.to_date)? (<label style={{ color: 'blue' }}>Transfered</label>):((ele.status === "Ongoing" ? (
                                                    <button onClick={() => goToInspectionForm(ele.scheduler_id, ele.asset_id, ele.asset_name, ele.emp_hrmantra_id, ele.emp_name, ele.dept_name)}>Start</button>
                                                ) : (
                                                    <label style={{ color: 'green' }}>Done</label>
                                                ))))}
                                                
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
                                    <th>Status</th>
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
                                                {ele.to_date == null ?((ele.status === "Ongoing" ? (
                                                    <button onClick={() => goToInspectionForm(ele.scheduler_id, ele.asset_id, ele.asset_name, ele.emp_hrmantra_id, ele.emp_name, ele.dept_name)}>Start</button>
                                                ) : (
                                                    <label style={{ color: 'green' }}>Done</label>
                                                ))):(new Date(ele.from_date)<=new Date() && new Date()<=new Date(ele.to_date)? (<label style={{ color: 'blue' }}>Transfered</label>):((ele.status === "Ongoing" ? (
                                                    <button onClick={() => goToInspectionForm(ele.scheduler_id, ele.asset_id, ele.asset_name, ele.emp_hrmantra_id, ele.emp_name, ele.dept_name)}>Start</button>
                                                ) : (
                                                    <label style={{ color: 'green' }}>Done</label>
                                                ))))}
                                                
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
                {isOtherTableVisible && (
                    <div className="scondary_table">
                        <div className="title_table"><p>Other Inspection :</p></div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Asset Code</th>
                                    <th>Asset Name</th>
                                    <th>Section</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {otherTableData.length > 0 ? (
                                    otherTableData.map((ele, index) => (
                                        <tr key={index}>
                                            <td style={{ border: "1px solid #ccc", padding: "8px" }}>{ele.asset_id}</td>
                                            <td style={{ border: "1px solid #ccc", padding: "8px" }}>{ele.asset_name}</td>
                                            <td style={{ border: "1px solid #ccc", padding: "8px" }}>{ele.section_name}</td>
                                            <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                                            {(ele.status === "Ongoing" ? (
                                                    <button onClick={() => goToInspectionForm(ele.scheduler_id, ele.asset_id, ele.asset_name, ele.emp_hrmantra_id, ele.emp_name, ele.dept_name)}>Start</button>
                                            ) : (
                                                    <label style={{ color: 'green' }}>Done</label>
                                                ))}
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

          {isAutomobileVisible && (
                    <div className="scondary_table">
                        <div className="title_table"><p>Daily Automobile Inspection :</p></div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Inspection No.</th>
                                    <th>Asset Id</th>
                                    <th>Asset Name</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                        {automobileTableData.length > 0 ? (
                         automobileTableData.map((ele, index) => {

                        const empName = autoMobileEmpData.length > 0 ? autoMobileEmpData[0].emp_name : '';
                        const deptName = autoMobileEmpData.length > 0 ? autoMobileEmpData[0].dept_name : '';

                        return (
                            <tr key={index}>
                                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{ele.inspection_no}</td>
                                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{ele.asset_id}</td>
                                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{ele.asset_name}</td>
                                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                                    {ele.inspection_status === "Ongoing" ? (
                                        <button onClick={() => goToInspectionForm(ele.inspection_no, ele.asset_id, ele.asset_name, inputValue, empName, deptName)}>Start</button>
                                    ) : (
                                        <label style={{ color: 'green' }}>Done</label>
                                    )}
                                </td>
                            </tr>
                        );
                    })
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
                                    <th>Status</th>
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
