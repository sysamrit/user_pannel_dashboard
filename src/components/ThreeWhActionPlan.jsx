import React from 'react'
import "../style/RCA_Form.css";


function ThreeWhActionPlan({inspector_name,index_no,update_Action_plan,value_obj}) {
  return (
  <>
       {/* Header Row */}
       {index_no === 0 && (
    <div className="action_plan_header">
    <label>What</label>
    <label>Who</label>
    <label>When</label>
    <label>How</label>
 </div>
       )}
    {/* Input Fields */}
    <  div className="action_plan_inputs">
    <input type="text" id="3wh_action1"  value={value_obj} onChange={(e) => { update_Action_plan(e.target.value, index_no, "what") }} />
    <input type="text" id="3wh_action2" list="doer_list" onChange={(e)=>{update_Action_plan(e.target.value,index_no,"who")}}   />
    <datalist id="doer_list">
      {inspector_name.map((inspector, index) => (
     <option
       key={index}
       value={`${inspector.emp_hrmantra_id} - ${inspector.emp_name}`}
     >
       {`${inspector.emp_hrmantra_id} - ${inspector.emp_name}`}
     </option>
   ))}
    </datalist>
    <input type="datetime-local" id="_3wh_action3" value={value_obj} onChange={(e) => { update_Action_plan(e.target.value, index_no, "when") }}/>

    <input type="text" id="3wh_action4" value={value_obj} onChange={(e) => { update_Action_plan(e.target.value, index_no, "how") }}/>
    </div>
    </>
  )
}

export default ThreeWhActionPlan;