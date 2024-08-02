import React from 'react';
import "../style/RCA_Form.css";

function CurrectiveAction({ update_Currective_Action, index_no, value_obj }) {
  return (
    <div className='currective_action_container'>
      {/* Header Row */}
      {index_no === 0 && (
        <div className="currective_action_header">
          <label>Cause</label>
          <label>Counter Measure 1</label>
          <label>Counter Measure 2</label>
        </div>
      )}
      {/* Content Row */}
      <div className='currective_action_content'>
        <label>{index_no + 1}</label>
        <input type='text' value={value_obj} onChange={(e) => { update_Currective_Action(e.target.value, index_no, "cause") }} />
        <input type='text' value={value_obj} onChange={(e) => { update_Currective_Action(e.target.value, index_no, "counter_measure1") }} />
        <input type='text' value={value_obj} onChange={(e) => { update_Currective_Action(e.target.value, index_no, "counter_measure2") }} />
      </div>
    </div>
  );
}

export default CurrectiveAction;
