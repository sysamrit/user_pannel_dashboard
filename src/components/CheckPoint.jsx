import React from 'react'
import SingleCheckPoint from './SingleCheckPoint'

function CheckPoint({data}) {
  return (
    <>
    <label htmlFor="" className='text-start'>Checklist</label>
    {data && data.map((ele,index)=>{
        return <SingleCheckPoint ques={ele.trim()} key={index} ele_number={index}/>
      
    })}
    </>
  )
}

export default CheckPoint