import React, { useEffect, useState } from 'react'
import Email from "../log_in/Email.js"
import Password from "../log_in/Password.js"


function Form_Login_Info() {
  const [stepNumber , setStepNumber] = useState(1)
  const [currentPageStep , setCurrentPageStep] = useState(<Email/>)

  useEffect(()=>{
    if(stepNumber == 2){
      setCurrentPageStep(<Password />)
    }else if(stepNumber == 1){
      setCurrentPageStep(<Email hanleNextStep={hanleNextStep}/>)
    }
   } , [stepNumber])


  const hanleNextStep = ()=>{
    setStepNumber(stepNumber => stepNumber+1)
   }
   const hanlePreviusStep = ()=>{
    setStepNumber(stepNumber => stepNumber-1)
   }


  return (
    <div className='login_templete'>
      {
        stepNumber>1 && <button className='btn' 
        onClick={hanlePreviusStep}>&lt; previus</button>
      }
      {currentPageStep}           
    </div>
  )
}

export default Form_Login_Info