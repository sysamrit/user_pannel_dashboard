import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import "../style/datatable.css";
import { FaRegWindowClose, FaSearch } from "react-icons/fa";
import { FaFileExport } from "react-icons/fa";
import DataTable from "react-data-table-component";


function DailyInspectionReport() {

  const [selectDepartment, setSelectDepartment] = useState([]);
  const [selectedDeptValue, setSelectedDeptValue] = useState("");
  const [searchText, setSearchText] = useState("");
  const [statusText, setStatusText] = useState(""); // New state for status filter
  const mainData=useRef();
  const [excelData, setExcelData] = useState([]);
  const [key, setKey] = useState(0); // Add key state
     // ...............end of view pop up data.......................
     const columns = [
        {
          name: "Date",
          selector: (row) => {
            const timeStamp = new Date();
            return timeStamp.toLocaleDateString(); // Only returning the date part
          },
          sortable: true,
          wrap: true,
        },
        {
          name: "Asset Code",
          selector: (row) => {
            return row.asset_number; // Assuming row.asset_number contains the asset code
          },
          sortable: true,
          wrap: true,
        },
        {
          name: "Asset Name",
          selector: (row) => row.asset_name,
          sortable: true,
          wrap: true,
        },
        {
          name: "Inspector Name & ID",
          selector: (row) => {
            return `${row.emp_hrmantra_id} - ${row.emp_name}`;
          },
          sortable: true,
          wrap: true,
        },
        {
          name: "Department",
          selector: (row) => row.dept_name,
          sortable: true,
          wrap: true,
        },
        {
          name: "Status",
          selector: (row) => {
            return row.status === "Ongoing" ? <font style={{color:"red"}}>Not Done</font> : <font style={{color:"green"}}>Done</font>;
          },
          sortable: true,
          wrap: true,
        },
      ];
      
  // This Api call when Loading the page 
  const [recordsData, setRecords] = useState([]);
  const [filterRecordData, setFilterRecordsData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = () => {
      axios
        .get(`${process.env.REACT_APP_BASE_URL2}/inspection/daily-inspection`)
        .then((res) => {
            console.log(res.data.result);
          setRecords(res.data.result);
          setFilterRecordsData(res.data.result);
          mainData.current=res.data.result;
          setKey(key + 1);
        })
        .catch((err) => console.log(err));
    };

    fetchData();
  }, []);


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
    

  // Seraching Portion with input fields and dropdown
  const handleFilter = (event) => {
  
    setSearchText(event.target.value);
  };
//   const handleStatusFilter = (event) => {
//     setStatusText(event.target.value);
//   };
  
const filterRecords = () => {
    let filteredData = mainData.current;

    if (searchText) {
      filteredData = filteredData.filter((row) => {
        const matchesAssetName = row.asset_name.toLowerCase().includes(searchText.toLowerCase());
        const matchesStatus = row.status.toLowerCase().includes(searchText.toLowerCase());
        return matchesAssetName || matchesStatus;
      });
    }
    setRecords(filteredData);
  };
  const filterRecordsByDepartment=()=>{
    let filteredData=filterRecordData;
    if (selectedDeptValue) {
      filteredData = filteredData.filter((row) =>
        row.dept_name.toLowerCase() === selectedDeptValue.toLowerCase()
      );
    }
    mainData.current=filteredData;
    setRecords(filteredData);
  };
  
  useEffect(() => {
    filterRecords();
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

//  Export data in a Excel file 
const exportToExcel = async() => {

    const url=`${process.env.REACT_APP_BASE_URL2}/inspection/today`;
    let response = await fetch(url);
    if (response.ok) {
  
      console.log("Request backed");
      console.log(response);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Daily_Inspection.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url); // Clean up
    } else {
      console.error("Failed to generate CSV File");
    }
      
  };

  return (
    <div className='base-div'>
    <div className='title'>
      <h3>Daily Inspection</h3>
    </div>
    <div className='export-btn'>
      <button type="button" onClick={exportToExcel}>
      <FaFileExport className="icon"/> Export Table
        </button>
    </div>
    <div
      style={{
        backgroundColor: "rgb(245, 242, 242)",
        display: "flex",
        alignItems: "center",
        marginTop: "30px",
      }}>
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

    <div style={{ backgroundColor: "rgb(245, 242, 242)", marginTop: "10px", height: "80vh", position: "relative",}}>
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
      </div>
  )
}

export default DailyInspectionReport