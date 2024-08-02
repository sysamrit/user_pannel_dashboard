import React from 'react'
import "../style/scheduleForm.css";

function SingleInputAdd({text,index_no,taskUpdate}) {
    return (
        <div style={{display:"flex",columnGap:"5px"}} className="task_content">

          <label>{index_no+1}</label>
            <input type="text" value={text} onChange={(e)=>{taskUpdate(e.target.value,index_no)}} />
        </div>
      )
}

export default SingleInputAdd