import React from 'react'

function SchedulePart({update_Currective_Part, index_no,value_obj}) {

    return (
        <div className='currective_part_container'>
          {/* Header Row */}
          {index_no === 0 && (
            <div className="currective_part_header">
              <label>Material</label>
              <label>Qty.</label>
            </div>
          )}
          {/* Content Row */}
          <div className='currective_part_content'>
            <label>{index_no + 1}</label>
            <input type='text' value={value_obj} onChange={(e) => { update_Currective_Part(e.target.value, index_no, "material") }} />
            <input type='number' value={value_obj} onChange={(e) => { update_Currective_Part(e.target.value, index_no, "qty") }} />
          </div>
        </div>
      );
}

export default SchedulePart