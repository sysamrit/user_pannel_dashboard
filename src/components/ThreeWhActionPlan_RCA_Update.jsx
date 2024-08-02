import React from 'react'

function ThreeWhActionPlan_RCA_Update({inspector_name,index_no,update_Action_plan,text}) {
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
          <input type="text" id="3wh_action1"  value={text.what} />
          <input type="text" id="3wh_action2" value={text.who} onChange={(e)=>{update_Action_plan(e.target.value,index_no,"who")}}   />
          
          <input type="text" id="_3wh_action3" value={text.when} onChange={(e) => { update_Action_plan(e.target.value, index_no, "when") }}/>
      
          <input type="text" id="3wh_action4" value={text.how} onChange={(e) => { update_Action_plan(e.target.value, index_no, "how") }}/>
          </div>
          </>
        )
}

export default ThreeWhActionPlan_RCA_Update