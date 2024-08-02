import React from 'react';
import "../style/RCA_Form.css";


function CorrectiveActionRCA_Update({ update_Currective_Action, index_no, text }) {
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
            <input type='text' value={text.cause} onChange={(e) => { update_Currective_Action(e.target.value, index_no, "cause") }} />
            <input type='text' value={text.counter_measure1} onChange={(e) => { update_Currective_Action(e.target.value, index_no, "counter_measure1") }} />
            <input type='text' value={text.counter_measure2} onChange={(e) => { update_Currective_Action(e.target.value, index_no, "counter_measure2") }} />
          </div>
        </div>
      );
}

export default CorrectiveActionRCA_Update