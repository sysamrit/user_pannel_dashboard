import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';
import CreateRCAForm from './CreateRCAForm';
import { FaSearch } from 'react-icons/fa';
import { TiExportOutline } from "react-icons/ti";
import { FaRegClone } from "react-icons/fa";
import RCA_UpdateModal from '../components/RCA_UpdateModal';
import RCA_Approval_Form from '../components/RCA_Approval_Form';
import RCAViewModal from '../components/RCAViewModal';




export const RCA = () => {
  const [isRCAContainerVisible, setIsRCAContainerVisible] = useState(false);
  const [selectDepartment, setSelectDepartment] = useState([]);
  const [selectedDeptValue, setSelectedDeptValue] = useState("");
  const [searchText, setSearchText] = useState("");
  const [updateRCAFormVisible, setUpdateRCAFormVisible] = useState(false);
  const [approvalRCAFormVisible, setApprovalRCAFormVisible] = useState(false);
  const [viewRCAForm, setViewRCAForm] = useState(false);
  const [viewRCAFormVisible, setViewRCAFormVisible] = useState(false);
  const [rcaUpdateData, setRcaUpdateData] = useState([]);
  const mainData=useRef();
  const [key, setKey] = useState(0); // Add key state


   // RCA UPDATE submenu Portion 
const updateRCA=(row)=>{
  setUpdateRCAFormVisible(true);
  setRcaUpdateData(row);
  // console.log(row);
}

const hideRCA_UpdateContainer = () => {
  setUpdateRCAFormVisible(false);
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
              <a onClick={() => updateRCA(row)}>Update</a>
            </div>
          </div>
        ),
      },
    {
        name: "RCA ID",
        selector: row => row.rca_id,
        sortable:true,
        wrap: true

    },
    {
        name: "RCA Date",
        selector: row => row.rca_date,
        sortable:true,
        wrap: true

    },
    {
        name: "Creator Name",
        selector: row => {
        return row.creator + " - " + row.emp_name;
        },
        sortable:true,
        wrap: true

    },
    {
        name: "Asset Id & Name",
        selector: row => 
          {
            return row.asset_id + " - " + row.asset_name;
            },
        sortable:true,
        wrap: true

    },
    {
        name: "Department",
        selector: row => row.department,
        sortable:true,
        wrap: true

    },
    {
        name: "Total Stopage Time",
        selector: row => row.total_stop_time,
        sortable:true,
        wrap: true

    },
    {
        name: "RCA Status",
        selector: row => row.rca_status,
        sortable:true,
        wrap: true

    },
 
];

const [recordsData,setRecords]=useState([]);
const [filterRecordData,setFilterRecordsData] = useState([]);
const navigate = useNavigate();


useEffect(() => {
  const fetchData = () => {
      axios.get(`${process.env.REACT_APP_BASE_URL2}/rca`)
          .then(res => {
              setRecords(res.data)
              setFilterRecordsData(res.data)
              mainData.current=res.data
              setKey(key + 1);

          })
          .catch(err => console.log(err));
  };
  if(updateRCAFormVisible === true){
    return;
  }
  fetchData();
}, [updateRCAFormVisible]); 

// const handleFilter=(event)=>{
//   const newData = filterRecordData.filter(row => row.emp_name.toLowerCase().includes(event.target.value.toLowerCase()));
//   setRecords(newData);
// }

const handleFilter = (event) => {
  
  setSearchText(event.target.value);
};

const filterRecordsByName = () => {
  let filteredData = mainData.current;

  if (searchText) {
    filteredData = filteredData.filter((row) =>
      row.emp_name.toLowerCase().includes(searchText.toLowerCase())
    );
  }
  setRecords(filteredData);
}
const filterRecordsByDepartment=()=>{
  let filteredData=filterRecordData;
  if (selectedDeptValue) {
    filteredData = filteredData.filter((row) =>
      row.department.toLowerCase() === selectedDeptValue.toLowerCase()
    );
  }
  mainData.current=filteredData;
  setRecords(filteredData);
};

useEffect(() => {
    filterRecordsByName();
}, [searchText]);

useEffect(() => {
  if(selectedDeptValue!=="none"){
    mainData.current=filterRecordData;
    filterRecordsByDepartment();
  }
}, [selectedDeptValue]);

const handleDepartmentChange = (event) => {
  const value = event.target.value;
  if (value === "none") {
    setSelectedDeptValue(value)
    // Reset the filter when "Select Department" is chosen
    setRecords(filterRecordData);
  }else{
    setSelectedDeptValue(value);
  }
};

const showRCAForm=()=>{
  setIsRCAContainerVisible(true);
}

const hideRCAForm=()=>{
  setIsRCAContainerVisible(false);

}

  // Drop Down Api

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





  return (
    <div className='base-div'> 
       <div className='title'>
       <h3>Root Cause Analysis</h3>
    </div>
    <div className='create_RCA'>
        <button onClick={showRCAForm}>
        <FaRegClone className="icon" /> Create RCA

        </button>
      </div>
    <div style={{ backgroundColor: "rgb(245, 242, 242)", display: 'flex', alignItems: 'center', marginTop: "25px" }}>
        <div style={{ flex: 1 }}>
        <select style={{ padding: "6px 10px", width: "30%", marginLeft: "13px" }}  value={selectedDeptValue} onChange={handleDepartmentChange}>
            <option value="none">Select Department</option>
            {
              selectDepartment && selectDepartment.map((ele,indx)=>{
              return <option
                    key={indx}
                    value={`${ele}`}
                  >
                    {`${ele}`}
                  </option>

              })
            }
          </select>
        </div>
        <div style={{ display: 'flex', justifyContent: 'right', marginRight: '17px', width:"50%"}}>
         <div style={{ position: 'relative', width: '50%' }}>
          <input
            type="text"
            placeholder='Search...'
            value={searchText}
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
                // customStyles={{
                //   cells: {
                //     style: {
                //       maxWidth: '200px', // Adjust max-width of cells if needed
                //       // overflow: 'hidden',
                //       textOverflow: 'ellipsis',
                //       whiteSpace: 'nowrap',
                //       wordWrap: 'break-word',
                //       wordBreak: 'break-all',
                //     },
                //   },
                // }}
            />
        </div>
        {/* <div className="floating-button" onClick={() => navigate('/inspection/inspection_form')}>
          <GoPlus />
          <span>Form</span>
        </div> */}
              {isRCAContainerVisible && <CreateRCAForm  toggleContainer={hideRCAForm} />}
              {updateRCAFormVisible && <RCA_UpdateModal data={rcaUpdateData} toggleContainer={hideRCA_UpdateContainer} />}
              {/* {approvalRCAFormVisible && <RCA_Approval_Form data={rcaUpdateData} toggleContainer={hideRCA_UpdateContainer} />} */}
              {viewRCAFormVisible && <RCAViewModal data={viewRCAForm} toggleContainer={hideFileContainer} />}


    </div>
  
  )
}
