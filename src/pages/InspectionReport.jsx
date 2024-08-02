import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import DataTable from "react-data-table-component";
// import { GoPlus } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import "../style/datatable.css";
import RCA_Form from "./RCA_Form";
import { FaRegWindowClose, FaSearch } from "react-icons/fa";
import { TiExportOutline } from "react-icons/ti";
import { FaFileExport } from "react-icons/fa";
import { ImDownload } from "react-icons/im";
import { RiCloseLargeLine, RiCloseLine } from "react-icons/ri";
import { IoCloseSharp } from "react-icons/io5";


// import CircularMenu from "../components/CircularMenu";
export const InspectionReport = () => {
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
  const [isRCAContainerVisible, setIsRCAContainerVisible] = useState(false);
  const [rcaCreateData, setRcaCreateData] = useState([]);
  const [checkPointData, setCheckPointData] = useState([]);
  const [assetDeployed_Data, setAssetDeployed_Data] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  const [toggleModal, setToggleModal] = useState(false);
  const [currentInspectionData, setCurrentInspectionData] = useState("");
  const [selectDepartment, setSelectDepartment] = useState([]);
  const [selectedDeptValue, setSelectedDeptValue] = useState("");
  const [searchText, setSearchText] = useState("");
  const mainData=useRef();
  const [excelData, setExcelData] = useState([]);
  const [key, setKey] = useState(0); // Add key state


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

  const viewOnClick = (row) => {
    setIsViewContainerVisible(true);
    setClickView(row);
  };

  const hideFileContainer = () => {
    setIsViewContainerVisible(false);
  };

  const showRCAContainer = (row) => {
    setIsRCAContainerVisible(true);
    setRcaCreateData(row);
    setCurrentInspectionData(row.inspection_id);
    console.log(row);
  };

  

  const hideRCAContainer = () => {
    setIsRCAContainerVisible(false);
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
            <a onClick={() => viewOnClick(row)}>View</a>
            <a>Share</a>
            <a>Create Workorder</a>
            <a>Create FCA</a>
            <a onClick={() => showRCAContainer(row)}>Create RCA</a>
          </div>
        </div>
      ),
    },
    {
      name: "Inspection ID",
      selector: (row) => row.inspection_id,
      sortable: true,
      wrap: true,
    },
    {
      name: "Date",
      selector: (row) => {
        var d = new Date(row.inspection_date);
        return d.toLocaleDateString() + " " + d.toLocaleTimeString();
      },
      sortable: true,
      wrap: true,
    },
    {
      name: "Asset",
      selector: (row) => {
        return row.asset_id + " - " + row.asset_name;
      },
      sortable: true,
      wrap: true,
    },
    {
      name: "Inspector",
      selector: (row) => {
        return row.emp_id + " - " + row.emp_name;
      },
      sortable: true,
      wrap: true,
    },
    {
      name: "Department",
      selector: (row) => {
        return row.department ;
      },
      sortable: true,
      wrap: true,
    },
    {
      name: "Fault",
      selector: (row) => row.inspection_faulty,
      sortable: true,
      wrap: true,
    },
    {
      name: "Corrective Action",
      selector: (row) => row.action_taken,
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
        .get(`${process.env.REACT_APP_BASE_URL2}/inspection/`)
        .then((res) => {
          setRecords(res.data);
          setFilterRecordsData(res.data);
          mainData.current=res.data
          setKey(key + 1);
        })
        .catch((err) => console.log(err));
    };
    if(isViewContainerVisible === true){
      return;
    }
    fetchData();
  }, [isViewContainerVisible]);

  // const handleFilter = (event) => {
  //   const newData = filterRecordData.filter((row) => row.asset_name.toLowerCase().includes(event.target.value.toLowerCase()));
  //   setRecords(newData);
  // };

  
  // Seraching Portion with input fields and dropdown
  const handleFilter = (event) => {
  
    setSearchText(event.target.value);
  };
  
  const filterRecordsByName = () => {
    let filteredData = mainData.current;
  
    if (searchText) {
      filteredData = filteredData.filter((row) =>
        row.asset_name.toLowerCase().includes(searchText.toLowerCase())
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

  // Drop Down Api Department

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




// Pdf Generator
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


//  Export data in a Excel file 
  const exportToExcel = async() => {

    const url=`${process.env.REACT_APP_BASE_URL2}/inspection/exportdata`;
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
      a.download = "inspectiondata.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url); // Clean up
    } else {
      console.error("Failed to generate CSV File");
    }
      
  };


  // Excel sheet table data export
  // const exportToExcel = () => {
   

  //   // const exportData = recordsData.map((record) => ({
  //   //   "Inspection ID": record.inspection_id,
  //   //   Date: new Date(record.inspection_date).toLocaleDateString() + " " + new Date(record.inspection_date).toLocaleTimeString(),
  //   //   Asset: record.asset_id + " - " + record.asset_name,
  //   //   Inspector: record.emp_id + " - " + record.emp_name,
  //   //   Fault: record.inspection_faulty,
  //   //   "Corrective Action": record.action_taken,
  //   // }));
  //   const worksheet = XLSX.utils.json_to_sheet();
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Inspection Report");
  //   XLSX.writeFile(workbook, "InspectionData.xlsx");
  // };


  return (
    <div className='base-div'>
      <div className='title'>
        <h3>Inspection Report</h3>
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

        {/* Click View Section */}

        {isViewContainerVisible && (
          <div
            className='view_container'
            style={{
              display: isViewContainerVisible ? "block" : "none",
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 3,
              border: "1px solid #ccc",
              backgroundColor: "#F2F3F4",
              boxShadow: "rgba(136, 165, 191, 0.48) 6px 2px 16px 0px, rgba(255, 255, 255, 0.8) -6px -2px 16px 0px",
              height: "85vh",
              width: "70%",
            }}>
            <div className='sub_div' style={{ maxHeight: "70vh", overflowY: "auto", padding: "15px" }}>
              <div
                className='inspectionReport_details_container'
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                  marginLeft: "40px",
                  marginRight: "20px",
                  marginTop: "5%",
                }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label htmlFor='inspection_id'>Inspection Id:</label>
                  <input type='text' name='inspection_id' id='inspection_id' value={clickedView.inspection_id} />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label htmlFor='emp_id'>Employee Id & Name:</label>
                  <input type='text' name='emp_id' id='emp_id' value={`${clickedView.emp_id} - ${clickedView.emp_name}`} />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label htmlFor='inspection_date'>Inspection Date:</label>
                  <input type='text' name='inspection_date' id='inspection_date' value={new Date(clickedView.inspection_date).toLocaleDateString() + " " + new Date(clickedView.inspection_date).toLocaleTimeString()} />
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label htmlFor='asset_id'>Asset ID & Name:</label>
                  <input type='text' name='asset_id' id='asset_id' value={`${clickedView.asset_id}-${clickedView.asset_name}`} />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label htmlFor='emp_name'>Asset Status:</label>
                  <input type='text' name='emp_name' id='emp_name' value={assetDeployed_Data.asset_status} />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label htmlFor='safe_use'>Asset Safe to Use:</label>
                  <input type='text' name='safe_use' id='safe_use' value={assetDeployed_Data.asset_safe_to_use} />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label htmlFor='asset_name'>Corrective Action:</label>
                  <input type='text' name='asset_name' id='asset_name' value={clickedView.action_taken} />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label htmlFor='deployed'>Deployed:</label>
                  <input type='text' name='deployed' id='deployed' value={assetDeployed_Data.deployed} />
                </div>
              </div>
              {/* this is table container */}
              <div style={{ margin: "20px 40px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={{ border: "1px solid #ccc",  padding: "8px", textAlign: "center"}}>
                        Check Point Data
                      </th>
                      <th style={{
                          border: "1px solid #ccc",
                          padding: "8px",
                          textAlign: "center",
                        }}>
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {checkPointData.map((item, index) => (
                      <tr key={index}>
                        <td style={{ border: "1px solid #ccc", padding: "8px" }}>{item.checkpoint_name}</td>
                        <td
                          style={
                            item.remark === "OK"
                              ? {
                                border: "1px solid #ccc",
                                padding: "8px",
                                color: "green",
                                textAlign: "center",
                                fontWeight: "bold",
                              }
                              : item.remark === "NOT OK"
                                ? {
                                  border: "1px solid #ccc",
                                  padding: "8px",
                                  color: "red",
                                  textAlign: "center",
                                  fontWeight: "bold",
                                }
                                : {
                                  border: "1px solid #ccc",
                                  padding: "8px",
                                  textAlign: "center",
                                  fontWeight: "bold",
                                }
                          }>
                          {item.remark}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* image portion */}
              <div className='image-container' style={{ marginTop: "20px" }}>
                <div
                  className='image-row'
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "Start",
                    gap: "10px",
                  }}>
                  {imageUrls &&
                    imageUrls.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={` ${index}`}
                        style={{
                          width: "calc(25% - 10px)",
                          height: "auto",
                          objectFit: "cover",
                        }}
                      />
                    ))}
                </div>
                {/*<div
                  className="image-row"
                  style={{
                    display: "flex",
                    justifyContent: "start",
                    gap: "10px",
                    marginTop: "10px",
                  }}
                >
                  {imageUrls.slice(4, 8).map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={` ${index}`}
                      style={{
                        width: "calc(25% - 10px)",
                        height: "auto",
                        objectFit: "cover",
                      }}
                    />
                  ))}
                </div>*/}
              </div>

              <div className='button-container' style={{ display: "flex", justifyContent: "space-between" }}>
                <button
                  type='button'
                  style={{
                    position: "absolute",
                    top: "90%",
                    // right: "40px",
                    left: "40px",
                    width: "20%",
                    backgroundColor: "#28B463",
                    color: "white",
                  }}
                  onClick={handleDownloadPdf}><ImDownload className="icon_download" /> 
                  Download PDF
                </button>
                <button
                  type='button'
                  onClick={hideFileContainer}
                  style={{
                    position: "absolute",
                    top: "90%",
                    right: "40px",
                    width: "20%",
                    backgroundColor: "#E74C3C",
                    color: "white",
                    fontSize:"18px"
                  }}> <RiCloseLargeLine className="icon_download" /> 
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* <div
        className="floating-button"
        onClick={() => navigate("/inspection/inspection_form")}
      >
        <GoPlus />
        <span>Form</span>
      </div> */}

      {isRCAContainerVisible && <RCA_Form data={rcaCreateData} toggleContainer={hideRCAContainer} inspectionNo={currentInspectionData} />}

      {/* Click RCA Create Section */}
    </div>
  );
};
