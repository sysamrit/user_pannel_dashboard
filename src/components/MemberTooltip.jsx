import React from 'react'
import "../style/membertooltip.css";
import { RxCross2 } from "react-icons/rx";
import { ImCross } from "react-icons/im";



function MemberTooltip({id,removeFunction}) {
    const  hrmantra_id=id.split(" - ")[0];
    const name=id.split(" - ")[1];
  return (
    <div className='member-tooltip'>
        <p>{hrmantra_id+" - "+name}</p>
        <button style={{width:"25px",height:"25px"}} onClick={()=>{removeFunction(hrmantra_id)}}><ImCross /></button>
    </div>
  )
}

export default MemberTooltip