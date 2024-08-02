import React, { useEffect, useRef, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import "../style/RCA_Form.css";
import axios from "axios";
import MemberTooltip from "../components/MemberTooltip";
import SingleObservation from "../components/SingleObservation";
import WhyObervation from "../components/WhyObervation";
import CurrectiveAction from "../components/CurrectiveAction";
import ThreeWhActionPlan from "../components/ThreeWhActionPlan";
import { RiCloseLargeFill, RiCloseLargeLine, RiUserAddLine } from "react-icons/ri";
// import { MdOutlineAddBox } from "react-icons/md";
// import { CgPlayListAdd } from "react-icons/cg";
import { TbPlaylistAdd } from "react-icons/tb";
import { BiAddToQueue } from "react-icons/bi";
import FileInputForRCA from "../components/FileInputForRCA";
import { useNavigate } from "react-router-dom";
import { FcApproval } from "react-icons/fc";
import CorrectiveActionRCA_Update from "./CorrectiveActionRCA_Update";
import ThreeWhActionPlan_RCA_Update from "./ThreeWhActionPlan_RCA_Update";
import { ImDownload } from "react-icons/im";

function RCA_Approval_Form({toggleContainer,data,inspectionNo}) {
    const [createdBy, setCreatedBy] = useState("");
    const [startTime, setStartTime] = useState("");
    const [stopTime, setStopTime] = useState("");
    const [totalStopageTime, setTotalStopageTime] = useState("");
    const [members, setMembers] = useState([]);
    const [observation, setObservation] = useState([])
    const [whyAnalysis, setWhyAnalysis] = useState([{why:"",reason:""}]);
    const [currectiveAction, setCurrectiveAction] = useState([{cause:"",counter_measure1:"",counter_measure2:""}]);
    const [_3whActionPlan, set_3whActionPlan] = useState([{what:"",who:"",when:"",how:""}]);
    const member_input= useRef();
    const [inspection_id,setInspection_id] = useState(inspectionNo);
    const [inspectors, setInspectors] = useState([]);
    const [problem_statement, setProblem_statement] = useState("");
    const [deptList, setDeptList] = useState([]);
    const [department, setDepartment] = useState("")
    const [dataToogle, setDataToogle] = useState(false)
    const [assetNumber, setAssetNumber] = useState("");
    const [assetName, setAssetName] = useState("");
    const navigate = useNavigate();

    const [rcaPrefillData, setRcaPrefillData] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);
    
    
  
    // Calculate the difference in days between start date and end date
  
  
    const addMember=()=>{
      const currentMember=member_input.current.value;
       setMembers([...members,currentMember]);
    }
    const removeMember=(id)=>{
      const newMemberList=members.filter((ele)=>!ele.startsWith(id));
      setMembers(newMemberList);
    }
    const addObservation=()=>{
      setObservation([...observation,""]);
    }
  
    const updateObservation=(content,index)=>{
     let currentObservation=observation;
     currentObservation[index]=content;
     setObservation(currentObservation);
    }
  
  
    const addWhyAnalysis=()=>{
      setWhyAnalysis([...whyAnalysis,{
        why:"",
        reason:""
      }]);
    }
  
    const updateWhyAnalysis=(content,indx,k)=>{
      let cuurent_why_analysis=whyAnalysis;
      cuurent_why_analysis[indx][k]=content;
      setWhyAnalysis(cuurent_why_analysis);
    }
  
    const addCurrectiveAction=()=>{
     setCurrectiveAction([...currectiveAction,{cause:"",counter_measure1:"",counter_measure2:""}]);
    }
  
    const updateCurrectiveAction=(content,indx,k)=>{
      let current_currective_action=currectiveAction;
      current_currective_action[indx][k]=content;
      setCurrectiveAction(current_currective_action);
  
    }
  
    const add3whActionPlan=()=>{
      set_3whActionPlan([..._3whActionPlan,{what:"",who:"",when:"",how:""}]);
    }
  
    const update3whActionPlan=(content,index,k)=>{
      let current_action_plan=_3whActionPlan;
      current_action_plan[index][k]=content;
      set_3whActionPlan(current_action_plan);
      
    }

    const getFormattedDateString=(datestring)=>{
        var d=new Date(datestring);
        return d.getDate()+"-"+(d.getMonth()+1)+"-"+d.getFullYear()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
    }

//................... .................Main API Calling................................... 
const observationRef = useRef([]);

useEffect(()=>{
    const fetchDept=()=>{
      axios.get(`${process.env.REACT_APP_BASE_URL2}/rca/get/${data.rca_id}`)
      .then((res)=>{
        console.log(res.data);
        let rca_data=res.data.rca_data;
        let rca_details=res.data.rca_details;
        setCreatedBy(`${rca_data[0]["creator"]} - ${rca_data[0]["emp_name"]}`);
        setAssetNumber(`${rca_data[0]["asset_id"]}`);
        setAssetName(`${rca_data[0]["asset_name"]}`);
        setDepartment(rca_data[0]['department']);
        setInspection_id(rca_data[0]['inspection_id'])
        setMembers(rca_details['members']);
        setStopTime(getFormattedDateString(rca_data[0]['stop_time']))
        setStartTime(getFormattedDateString(rca_data[0]['start_time']))
        setProblem_statement(rca_details["problem_statement"])
        setTotalStopageTime(rca_data[0]['total_stop_time'])
        setObservation(rca_details['observations'].map(ele => ele));
        setWhyAnalysis(rca_details['why_analysis'].map(ele => ele));
        setCurrectiveAction(rca_details['corrective_action'].map(ele => ele));
        set_3whActionPlan(rca_details['_3wh_action_plan'].map(ele => ele));
        setImageUrls([...rca_details['filenames']]);

      })
      .catch((err)=>console.log(err));
    }
    fetchDept();
  },[]);

  useEffect(()=>{
  },[dataToogle]);








    
    const handleSubmit = (e) => {
      e.preventDefault();
  
      const formData = new FormData(e.target);
      formData.append("created_by", createdBy);
      formData.append("inspection_id", inspection_id);
      // formData.append("work_order",work_Order);
      formData.append("problem_statement", problem_statement);
      formData.append("start_time", startTime);
      formData.append("stop_time", stopTime);
      formData.append("total_stopage_time", totalStopageTime);
      formData.append("members",JSON.stringify(members));
      formData.append("observations",JSON.stringify(observation));
      formData.append("why_analysis",JSON.stringify(whyAnalysis));
      formData.append("corrective_action",JSON.stringify(currectiveAction));
      formData.append("_3wh_action_plan",JSON.stringify(_3whActionPlan));
  
      axios
        .post(`${process.env.REACT_APP_BASE_URL2}/rca/saveresponse`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          if(res.data.status==="Saved"){
            alert("Data Saved");
            toggleContainer();
            // navigate("/inspection/rca");
          }
        })
        .catch((err) => console.log(err));
    };
  
    // useEffect(() => {
    //   const fetchData = () => {
    //     axios
    //       .get(`${process.env.REACT_APP_BASE_URL2}/worker`)
    //       .then((res) => {
    //         setInspectors(res.data);
    //       })
    //       .catch((err) => console.log(err));
    //   };
  
    //   fetchData();
    // }, []);
  
    // useEffect(()=>{
    //   const fetchDept=()=>{
    //     axios.get(`${process.env.REACT_APP_BASE_URL2}/general/dept`)
    //     .then((res)=>{
    //       setDeptList(res.data);
    //     })
    //     .catch((err)=>console.log(err));
    //   }
    //   fetchDept();
    // },[]);


  return (
    <>
      <div className="view_container">
        <div>
          <h4 className="heading_contant">Root Cause Analysis</h4>
          <hr className="header-line"/>
          
        </div>
        <form onSubmit={handleSubmit}>
        <div className="rca_create_container">
          <div className="sub_div">
            <h5 style={{ marginLeft: "32px" ,fontWeight:500}}>RCA_Details</h5>
            <div className="form_container">
            <div className="form_item">
                <label htmlFor="link_workorder">Created By</label>
                <input type="text"  id="created_by" value={createdBy} onChange={(e)=>{setCreatedBy(e.target.value)}}
                />
              </div>

              <div className="form_item">
                <label htmlFor="link_workorder">RCA ID</label>
                <input type="text"  id="link_workorder" value={data.rca_id} readOnly />
                
              </div>
              
              {/* Dept */}
              <div className="form_item">
                <label htmlFor="link_workorder">Department</label>
                <input type="text"  id="dept" value={department}  name="department" readOnly />
                <datalist id="dept_data">
                 {deptList.map((dept, index) => (
                <option
                  key={index}
                  value={`${dept}`}
                >
                  {`${dept}`}
                </option>
              ))}
            </datalist>
              </div>
              <div className="form_item">
                <label htmlFor="link_workorder">Link Inspection</label>
                <input type="text"  id="link_workorder" value={inspection_id} readOnly />
                
              </div>
              <div className="form_item">
                <label htmlFor="members">Link Workorder</label>
                <input type="text"  id="members" />
              </div>
              <div className="form_item " >
                <label htmlFor="member">Members</label>
                <div className="member_section">
                <input type="text"  list="member_list" id="member"  ref={member_input} />
                <datalist id="member_list">
                 
            </datalist>
                <button className="member_btn" onClick={addMember}>
                   <RiUserAddLine className="icon" />Add Member
                </button>
                <div className="member_names">
                  {members && members.map((ele,index)=>{
                     return  <MemberTooltip id={ele} key={index}  removeFunction={removeMember}/>
                  })}
            
                </div>
                </div>
              </div>

              <h5>Asset Details</h5>
              <div className="form_item">
                <label htmlFor="asset_id">Asset Number</label>
                <input type="text"  id="asset_id" value={assetNumber} readOnly/>
              </div>
              <div className="form_item">
                <label htmlFor="asset_name">Asset Name</label>
                <input type="text" id="asset_name" value={assetName} readOnly />
              </div>
            </div>
            <div className="form_item1">
              <label htmlFor="problem_statement">Problem Statement</label>
              <input type="text" id="problem_statement" onChange={(e)=>setProblem_statement(e.target.value)} value={problem_statement} />
              
            </div>
            {/* Calender Section */}
           <div className="date_container">
                <div className="calender_content">
                   <label htmlFor="start_date">Stopage Time</label>
                   <input type="text"  id="start_date" onChange={(e)=>{setStopTime(e.target.value);}} value={stopTime}/>
                </div>
                <div className="calender_content">
                   <label htmlFor="end_date">Start Time</label>
                   <input  id="end_date" onChange={(e)=>{setStartTime(e.target.value);}} value={startTime} />
                 </div>
                 <div className="calender_content">
                  <label htmlFor="duration">Duration(D:H:M:S):</label>
                  <input type="text" id="duration" value={totalStopageTime} readOnly className="datepicker_input" />
                 </div>
            </div>

            {/* Observation */}
            <div className="observation_section">
             <div>
              <h5 style={{textAlign:"center",fontWeight:500}}>Observation</h5>
              <hr className="header-line"/>

              </div> 
               <div className="obs_table">
                {observation && observation.map((ele,indx)=>{
                  return <SingleObservation observationUpdate={updateObservation} key={indx} index_no={indx} text={ele}/>
                })}
                  <div className="button_container">
                <button onClick={addObservation} type="button">
                <TbPlaylistAdd className="icon_observ" />Add Observation</button>
                </div>
               </div>
            </div>
              {/* Why Why Analysis */}
            <div className="why_analysis_section">
           <div style={{textAlign:"center",fontWeight:500}}>
            <h5>Why Why Analysis</h5>
            <hr className="header-line"/>
            </div>
           <div className="why_observation">
            {whyAnalysis && whyAnalysis.map((ele,indx)=>{
                return <WhyObervation update_WhyAnalysis={updateWhyAnalysis}  key={indx} index_no={indx} text={ele}/>
              })}
              <div className="analysis_btn"><button type="button" onClick={addWhyAnalysis}> <TbPlaylistAdd className="icon_analys" />Add Analysis</button></div>
           </div>
            </div>

            {/* Currective Action */}

            <div className="currective_Action_section">
              <div style={{textAlign:"center",fontWeight:500}}>
                <h5>Corrective Action</h5>
                <hr className="header-line"/>
                </div>
              <div className="currective_action">
                {currectiveAction && currectiveAction.map((ele,index)=>{
               return <CorrectiveActionRCA_Update update_Currective_Action={updateCurrectiveAction}  key={index} index_no={index} text={ele} />

              })}
                <div className="curr_active_btn"><button type="button" onClick={addCurrectiveAction}> <TbPlaylistAdd className="icon_corrective" />Add Corrective Action</button></div>
              </div>
            </div>
            {/* 3WH Action Plan */}
            <div className="threewh_action_plan">
               <div style={{ textAlign: "center",fontWeight:500 }}>
                <h5>3WH Action Plan</h5>
                <hr className="header-line"/>
               </div>
                <div className="action_plan_container">
                 
                {_3whActionPlan && _3whActionPlan.map((ele,index)=>{
               return <ThreeWhActionPlan_RCA_Update update_Action_plan={update3whActionPlan}  key={index} index_no={index} text={ele} inspector_name={inspectors}/>

              })}
                <div className="active_plan_btn"><button type="button" onClick={add3whActionPlan}> <TbPlaylistAdd className="icon_plan"/>Add Plan</button></div>
          </div>
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
                        src={`${process.env.REACT_APP_BASE_URL2}/rca/images/get/${url}`}
                        alt={` ${index}`}
                        style={{
                          width: "calc(25% - 10px)",
                          height: "auto",
                          objectFit: "cover",
                        }}
                      />
                    ))}
                </div>
            
              </div>
         
          </div>
        </div>
        {/* Button Slot */}
        <div
          className="RCA_button_container"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <button type="submit" className="submit_btn" style={{
                    position: "absolute",
                    top: "90%",
                    // right: "40px",
                    left: "40px",
                    width: "20%",
                    backgroundColor: "#28B463",
                    color: "white",
                  }}> 
            <ImDownload className="icon_create" />
            RCA Download
          </button>
          <button className="close_btn" type="button" onClick={toggleContainer}><RiCloseLargeFill className="icon" />
            Close
          </button>
        </div>
        </form>
      </div>
    </>
  )
}

export default RCA_Approval_Form