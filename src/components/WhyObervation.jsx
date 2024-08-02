import React from 'react';
import "../style/RCA_Form.css";

function WhyObervation({ text, index_no, update_WhyAnalysis }) {
  return (
    <div className='why_container'>
      {/* Header Row */}
      {index_no === 0 && (
        <div className="why_header">
          <label>Why</label>
          <label>Reasons</label>
        </div>
      )}
      <div className='why_content'>
        <label>{index_no + 1}</label>
        <input type='text' value={text.why} onChange={(e) => { update_WhyAnalysis(e.target.value, index_no, "why") }} />
        <input type='text' value={text.reason} onChange={(e) => { update_WhyAnalysis(e.target.value, index_no, "reason") }} />
      </div>
    </div>
  );
}

export default WhyObervation;
