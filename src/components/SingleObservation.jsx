import React from 'react'
import "../style/RCA_Form.css";

function SingleObservation({text,index_no,observationUpdate}) {
  return (
    <div style={{display:"flex",columnGap:"5px"}} className="obs_content">
      <label>{index_no+1}</label>
        <input type="text" value={text} onChange={(e)=>{observationUpdate(e.target.value,index_no)}} />
    </div>
  )
  
}

export default SingleObservation