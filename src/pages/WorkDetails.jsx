import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import "../style/datatable.css";
import { FaSearch } from "react-icons/fa";
import { TiExportOutline } from "react-icons/ti";
import { FaFileExport } from "react-icons/fa";
import AssignWorkUpdate from "../components/AssignWorkUpdate";

function WorkDetails() {
    const [clickedView, setClickView] = useState({
        inspection_id: "",
        inspection_date: "",
        inspection_faulty: "",
        action_taken: "",
        asset_id: "",
        asset_name: "",
        emp_id: "",
        emp_name: "",
      });
    
      // This is the view popup useState
      const [isViewContainerVisible, setIsViewContainerVisible] = useState(false);
      const [isAssignUpdateVisible, setIsAssignUpdateVisible] = useState(false);
      // const [rcaCreateData, setRcaCreateData] = useState([]);
      const [updateAssignData, setUpdateAssignData] = useState([]);
      const [checkPointData, setCheckPointData] = useState([]);
      const [assetDeployed_Data, setAssetDeployed_Data] = useState(false);
      const [imageUrls, setImageUrls] = useState([]);
      const [toggleModal, setToggleModal] = useState(false);
      const [currentInspectionData, setCurrentInspectionData] = useState("");
      const [selectDepartment, setSelectDepartment] = useState([]);
      const [selectedDeptValue, setSelectedDeptValue] = useState("");
      const [searchText, setSearchText] = useState("");
      const [key, setKey] = useState(0); // Add key state
      const mainData=useRef();

    
      useEffect(() => {
        const url = `${process.env.REACT_APP_BASE_URL2}/inspection/single/${clickedView.inspection_id}`;
        axios
          .get(url)
          .then((res) => {
            setCheckPointData(res.data.checkpoint_data);
            console.log(res.data.checkpoint_data);
            setAssetDeployed_Data(res.data);
            console.log(res.data);
            // console.log(res.data.checkpoint_data);
            let imageUrls_data = res.data.checkpoint_data;
            var assetImages=[];
            imageUrls_data.map(ele=>{
              let cFileslength=ele['files'].length;
              if(cFileslength>=1){
                ele['files'].map(imgurl=>assetImages.push(imgurl));
              }
            });
            
            let stateImageUrlData = [];
            for (let assetImg in assetImages) {
              if (assetImages[assetImg] === null || assetImages[assetImg] === undefined) {
                continue;
              } else {
                let imgurl = `${process.env.REACT_APP_BASE_URL2}/inspection/images/get/${assetImages[assetImg]}`;
                stateImageUrlData.push(imgurl);
              }
            }
            setImageUrls([...stateImageUrlData]);
          })
          .catch((err) => console.log(err));
      }, [clickedView]);
    
      // const viewWorkDetails = (row) => {
      //   setIsViewContainerVisible(true);
      //   setClickView(row);
      // };
    
      // const hideFileContainer = () => {
      //   setIsViewContainerVisible(false);
      // };

    
      const updateWorkDetails = (row) => {
        setIsAssignUpdateVisible(true);
        setUpdateAssignData(row);
        // setCurrentInspectionData(row.inspection_id);
        console.log(row);
      };
    
      
    
      const hideAssignUpdateContainer = () => {
        setIsAssignUpdateVisible(false);
      };
      // ...............end of view pop up data.......................
      const columns = [
        {
          name: "Action",
          cell: (row) => (
            <div className='action-container'>
              <button className='action-btn'> 
                <TiExportOutline className="icon" /> Action
              </button>
              <div className='dropdown-content'>
                <a onClick={() => updateWorkDetails(row)}>Update</a>
               
              </div>
            </div>
          ),
        },
        {
          name: "Assign ID",
          selector: (row) => row.assinged_id,
          sortable: true,
          wrap: true,
        },
        {
          name: "Asset",
          selector: (row) => {return row.asset_number+" - "+row.asset_name},
          sortable: true,
          wrap: true,
        },
        {
          name: "Assign Work",
          selector: (row) => row.assigned_work,
          sortable: true,
          wrap: true,
        },
        {
          name: "Assign By",
          selector: (row) =>{
            return row.assigned_by + " - " + row.created_person_name;
          },
          sortable: true,
          wrap: true,
        },
        {
          name: "Assign Note",
          selector: (row) => row.assigned_note,
          
          sortable: true,
          wrap: true,
        },
        {
          name: "Assign Person",
          selector: (row) => row.assigned_person,     
          sortable: true,
          wrap: true,
        },
        {
          name: "Assign Department",
          selector: (row) => row.assigned_dept,
          sortable: true,
          wrap: true,
        },
        {
          name: "Assign Status",
          selector: (row) => row.work_status,
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
            .get(`${process.env.REACT_APP_BASE_URL2}/assignwork/`)
            .then((res) => {
              setRecords(res.data);
              setFilterRecordsData(res.data);
              mainData.current=res.data
              setKey(key + 1);
            })
            .catch((err) => console.log(err));
        };
        if(isAssignUpdateVisible === true){
          return;
        }
        fetchData();
      }, [isAssignUpdateVisible]);
    
      // const handleFilter = (event) => {
      //   const newData = filterRecordData.filter((row) => row.asset_name.toLowerCase().includes(event.target.value.toLowerCase()));
      //   setRecords(newData);
      // };
    
      const handleFilter = (event) => {
  
        setSearchText(event.target.value);
      };
      
      const filterRecordsByName = () => {
        let filteredData = mainData.current;
      
        if (searchText) {
          filteredData = filteredData.filter((row) =>
            row.created_person_name.toLowerCase().includes(searchText.toLowerCase())
          );
        }
        setRecords(filteredData);
      }
      const filterRecordsByDepartment=()=>{
        let filteredData=filterRecordData;
        if (selectedDeptValue) {
          filteredData = filteredData.filter((row) =>
            row.assigned_dept.toLowerCase() === selectedDeptValue.toLowerCase()
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
    
    
    
    
    //pdf generator
      const handleDownloadPdf = async () => {
        const url = `${process.env.REACT_APP_BASE_URL2}/inspection/genpdf/${clickedView.inspection_id}`;
        let response = await fetch(url);
        // response=await response.json();
        // console.log(response)
        if (response.ok) {
      
          console.log("Request backed");
          console.log(response);
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${clickedView.inspection_id}.pdf`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url); // Clean up
        } else {
          console.error("Failed to generate PDF");
        }
      };
    
      // Excel sheet table data export
      const exportToExcel = () => {
        const exportData = recordsData.map((record) => ({
          "Inspection ID": record.inspection_id,
          Date: new Date(record.inspection_date).toLocaleDateString() + " " + new Date(record.inspection_date).toLocaleTimeString(),
          Asset: record.asset_id + " - " + record.asset_name,
          Inspector: record.emp_id + " - " + record.emp_name,
          Fault: record.inspection_faulty,
          "Corrective Action": record.action_taken,
        }));
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Inspection Report");
        XLSX.writeFile(workbook, "InspectionData.xlsx");
      };
    
      // const exportToExcel = () => {
      //   const worksheet = XLSX.utils.json_to_sheet(recordsData);
      //   const workbook = XLSX.utils.book_new();
      //   XLSX.utils.book_append_sheet(workbook, worksheet, "Inspection Report");
      //   XLSX.writeFile(workbook, "Inspection_Report.xlsx");
      // };
    
      return (
        <div className='base-div'>
          <div className='title'>
            <h3>Assign Works</h3>
          </div>
          <div className='export-btn'>
            <button onClick={exportToExcel}>
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
    
          <div
            style={{
              backgroundColor: "rgb(245, 242, 242)",
              marginTop: "10px",
              height: "80vh",
              position: "relative",
            }}>
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
    
          {isAssignUpdateVisible && <AssignWorkUpdate data={updateAssignData} toggleContainer={hideAssignUpdateContainer} inspectionNo={currentInspectionData} />}
    
          {/* Click RCA Create Section */}
        </div>
      );
}

export default WorkDetails