import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { TiExportOutline } from "react-icons/ti";
import { FaRegClone } from "react-icons/fa";
import "../style/schedules.css";
import { IoCheckmarkDoneCircleSharp } from 'react-icons/io5';
import SchedulesCreateForm from '../components/SchedulesCreateForm';


function Schedules() {
    
    const [isRCAContainerVisible, setIsRCAContainerVisible] = useState(false);
    const [selectDepartment, setSelectDepartment] = useState([]);
    const [scheduleFormVisible, setScheduleFormVisible] = useState(false);
    const [approvalRCAFormVisible, setApprovalRCAFormVisible] = useState(false);
    const [viewRCAForm, setViewRCAForm] = useState(false);
    const [viewRCAFormVisible, setViewRCAFormVisible] = useState(false);
    const [rcaUpdateData, setRcaUpdateData] = useState([]);
    const mainData=useRef();
    const [key, setKey] = useState(0); // Add key state
  
  // Schedule Form Visible
  const clickCreateSchedule=()=>{
    setScheduleFormVisible(true);
  }
  
  const hideScheduleForm = () => {
    setScheduleFormVisible(false);
  };
  
  // This portion is the  view modal of RCA form
  const viewRCA=(row)=>{
    setViewRCAFormVisible(true);
    setViewRCAForm(row);
    console.log(row);
  }
  
  const hideFileContainer = () => {
    setViewRCAFormVisible(false);
  };
  
    const columns = [
      {
          name: "Action",
          cell: (row) => (
            <div className="action-container">
              <button className="action-btn">
              <TiExportOutline className="icon" /> Action
                </button>
              <div className="dropdown-content">
                <a onClick={() => viewRCA(row)}>View</a>
                <a onClick="">Update</a>
              </div>
            </div>
          ),
        },
      {
          name: "Schedule",
          selector: row => row.service_id,
          sortable:true,
          wrap: true
  
      },
      {
          name: "Asset Number",
          selector: row => {
            return row.asset_number + " - " + row.asset_name;
            },
          sortable:true,
          wrap: true
  
      },
      {
          name: "Due",
          selector: row => Math.abs(row.service_due),
          sortable:true,
          wrap: true
  
      },
      {
          name: "Last Service Date",
          // selector: row => row.last_service_date,
          selector: (row) => {
            var d = new Date(row.last_service_date);
            return d.toLocaleDateString() + " " + d.toLocaleTimeString();
          },
          sortable:true,
          wrap: true
  
      },
      {
          name: "Workorder",
          selector: row => row.service_id,
          sortable:true,
          wrap: true
  
      },
      
  ];
  
  const [recordsData,setRecords]=useState([]);
  const [filterRecordData,setFilterRecordsData] = useState([]);
  const navigate = useNavigate();
  
  
  useEffect(() => {
    const fetchData = () => {
        axios.get(`${process.env.REACT_APP_BASE_URL2}/service-maintenance`)
            .then(res => {
                setRecords(res.data)
                console.log(res.data);
                setFilterRecordsData(res.data)
                mainData.current=res.data
                setKey(key + 1);
  
            })
            .catch(err => console.log(err));
    };
    fetchData();
  }, []); 
  
  const handleFilter=(event)=>{
    const newData = filterRecordData.filter(row => row.asset_name.toLowerCase().includes(event.target.value.toLowerCase()));
    setRecords(newData);
  }
  
  
  const showRCAForm=()=>{
    setIsRCAContainerVisible(true);
  }
  
    // Drop Down Api
    // useEffect(()=>{
    //   const fetchDept=()=>{
    //     axios.get(`${process.env.REACT_APP_BASE_URL2}/general/dept`)
    //     .then((res)=>{
    //       // console.log(res.data);
    //       setSelectDepartment(res.data);
    //     })
    //     .catch((err)=>console.log(err));
    //   }
    //   fetchDept();
    // },[]);
  
  
    return (
      <div className='base-div'> 
         <div className='title'>
         <h3>Maintenance Schedules</h3>
      </div>
      <div className='completeSchedule'>
          <button onClick={showRCAForm}>
          <IoCheckmarkDoneCircleSharp className="icon" style={{fontSize:"25px"}}/> Completed Schedule
  
          </button>
        </div>
       <div className='schedule_create'>
          <div style={{ flex: 1 }}>
          <button onClick={clickCreateSchedule} type='button'>
          <FaRegClone className="icon" /> Create Schedule
  
          </button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'right', marginRight: '17px', width:"50%"}}>
           <div style={{ position: 'relative', width: '50%' }}>
            <input
              type="text"
              placeholder='Search...'
              onChange={handleFilter}
              style={{ padding: "6px 10px", width: "100%" }}
            />
            <FaSearch style={{ position: 'absolute', right: '10px', top: '45%', transform: 'translateY(-50%)' }} />
           </div>
        </div>
        </div>
  
        <div style={{ backgroundColor: "rgb(245, 242, 242)", marginTop: "10px" }}>
  
              <DataTable 
                   key={key}
                  columns={columns}
                  data={recordsData}              
                  pagination
                  fixedHeader
                  fixedHeaderScrollHeight="460px"
                  responsive
                  highlightOnHover
                  customStyles={{
                    rows: {
                      style: {
                        minHeight: "90px",
                      },
                    },
                    cells: {
                      style: {
                        paddingLeft: "16px",
                        paddingRight: "16px",
                        wordBreak: "break-word",
                        minWidth: "50px",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        wordWrap: "break-word",
                      },
                    },
                  }}
            
              />
          </div>
 
                {/* {isRCAContainerVisible && <CreateRCAForm  toggleContainer={hideRCAForm} />}
                {viewRCAFormVisible && <RCAViewModal data={viewRCAForm} toggleContainer={hideFileContainer} />} */}
                {scheduleFormVisible && <SchedulesCreateForm data={rcaUpdateData} toggleContainer={hideScheduleForm} />}
  
  
      </div>
    
    )
}

export default Schedules