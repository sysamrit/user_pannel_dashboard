import React,{useEffect, useState} from 'react'
import { BiAddToQueue } from 'react-icons/bi';
import { RiCloseLargeFill } from 'react-icons/ri';
import { TbPlaylistAdd } from 'react-icons/tb';
import ThreeWhActionPlan from './ThreeWhActionPlan';
import CurrectiveAction from './CurrectiveAction';
import "../style/RCA_Form.css";
import axios from "axios";
import { MdAssignmentInd } from 'react-icons/md';

function AssignWorkUpdate({data, toggleContainer,inspectionNo }) {

  

    const [assignedperson, setAssignedperson] = useState("")
    const [assigned_work, setAssigned_work] = useState("")
    const [assigned_id, setAssigned_id] = useState(data.assinged_id);
    const [assignPerson, setAssignPerson] = useState([]);



    useEffect(() => {
      const fetchData = () => {
        axios
          .get(`${process.env.REACT_APP_BASE_URL2}/worker`)
          .then((res) => {
            setAssignPerson(res.data);
          })
          .catch((err) => console.log(err));
      };
  
      fetchData();
    }, []);
  

    const handleAuthentication = () => {
        const hrmantraId = window.prompt("Enter your ID:");
        if (hrmantraId !== null) {
          const password = window.prompt("Enter your password:");
          if (password !== null) {
            const dept=data.assigned_dept.toLowerCase();
            console.log(dept);
            axios.post(`${process.env.REACT_APP_BASE_URL2}/assignwork/hod/access`,{department:dept,id:hrmantraId,password},{
                headers:{"Content-Type":"application/json"}
            })
            .then((res)=>{
                if(res.status===200){
                    axios.put(`${process.env.REACT_APP_BASE_URL2}/assignwork/update/`,{assignid:assigned_id,assigned_work:assigned_work,assigned_person:assignedperson})
                    .then(response=>{
                        console.log(response);//
                    })
                    .catch(err=>{
                       console.log(err) 
                    })
                }
            })
            .catch((errRES)=>{
                alert(errRES.response.data);
                return;
            })
          }else{
            return
          }
        }else{
            return;
        }
    }



  return (
    <>
      <div className="view_container">
        <div>
          <h4 className="heading_contant">Assign Work Update</h4>
          <hr className="header-line"/>
          
        </div>
        <form onSubmit="">
        <div className="rca_create_container">
          <div className="sub_div">
            <h5 style={{ marginLeft: "32px" ,fontWeight:500}}>Working Details</h5>
            <div className="form_container">
            <div className="form_item">
                <label htmlFor="link_workorder">Assign Id</label>
                <input type="text"  id="created_by"  value={assigned_id} onChange={(e)=>{setAssigned_id(e.target.value)}}  readOnly/>
            
              </div>
              <div className="form_item">
                <label htmlFor="dept">Department</label>
                <input type="text"  id="dept" name="department" value={data.assigned_dept} readOnly/>
               
              </div>
              <div className="form_item">
                <label htmlFor="assign_By">Assign By</label>
                <input type="text"  id="assign_by" value={data.assigned_by +" - "+data.created_person_name} readOnly />
                
              </div>
              <div className="form_item">
                <label htmlFor="assign_note">Assign Note</label>
                <input type="text"  id="members" value={data.assigned_note} readOnly />
              </div>
            
              <div className="form_item">
                <label htmlFor="assign_work">Assign Work</label>
                <input type="text"  id="asset_id" name='assign_work' value={assigned_work} onChange={(e)=>{setAssigned_work(e.target.value)}}/>
              </div>
              <div className="form_item">
                <label htmlFor="asset_name">Assign Person</label>
                <input type="text" id="asset_name"  name='assign_person' list="assign_person" value={assignedperson} onChange={(e)=>{setAssignedperson(e.target.value)}} />
                <datalist id="assign_person">
                 {assignPerson.map((inspector, index) => (
                <option
                  key={index}
                  value={`${inspector.emp_hrmantra_id} - ${inspector.emp_name}`}
                >
                  {`${inspector.emp_hrmantra_id} - ${inspector.emp_name}`}
                </option>
              ))}
            </datalist>
              </div>
            </div>        
          </div>
        </div>
        {/* Button Slot */}
        <div
          className="RCA_button_container"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <button type="button" className="submit_btn" onClick={handleAuthentication} > <MdAssignmentInd className="icon_create" />
            Assign
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

export default AssignWorkUpdate