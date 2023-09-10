import React, { useEffect, useState } from 'react'

//steps
import Personal_Info from '../sign_up/Personal_Info'
import Phone from '../sign_up/Phone'
import LogInDetails from '../sign_up/LogInDetails'

function Form_Signup_info() {
  const [stepNumber , setStepNumber] = useState(1)
  const [currentPageStep , setCurrentPageStep] = useState(<Personal_Info />) 

   useEffect(()=>{
    if(stepNumber == 2){
      setCurrentPageStep(<Phone hanleNextStep={hanleNextStep} statge='sign_up_statge'/>)
    }else if(stepNumber == 3){
      setCurrentPageStep(<LogInDetails/>)
    }else if(stepNumber == 1){
      setCurrentPageStep(<Personal_Info hanleNextStep={hanleNextStep} />)
    }
   },[stepNumber])

   const hanleNextStep = ()=>{
    //style
    const stepNext = document.getElementById(`step_${stepNumber+1}`)
    stepNext.style.borderTopRightRadius = '30px'
    stepNext.style.borderBottomRightRadius = '30px'
    stepNext.style.backgroundColor = 'rgb(181, 50, 115)'
    stepNext.style.color = 'white'

    const stepPrevius = document.getElementById(`step_${stepNumber}`)
    stepPrevius.style.borderTopRightRadius = '0px'
    stepPrevius.style.borderBottomRightRadius = '0px'
    //

    setStepNumber(stepNumber => stepNumber+1)
   }
   const hanlePreviusStep = ()=>{

     //style
     const stepNext = document.getElementById(`step_${stepNumber-1}`)
     stepNext.style.borderTopRightRadius = '30px'
     stepNext.style.borderBottomRightRadius = '30px'

 
     const stepPrevius = document.getElementById(`step_${stepNumber}`)
     stepPrevius.style.borderTopRightRadius = '0px'
     stepPrevius.style.borderBottomRightRadius = '0px'
     stepPrevius.style.backgroundColor = 'transparent'
     stepPrevius.style.color = 'black'
     //

    setStepNumber(stepNumber => stepNumber-1)
   }

  return (
    <div className='sign_up_template multi_step_form'>
        <div className='step_container'>  
          <div id='step_1' className='step'>Step 1</div>  
          <div id='step_2' className='step'>Step 2</div>
          <div id='step_3' className='step'>Step 3</div>
        </div> 
        {
          stepNumber>1 && <button className='btn' 
          onClick={hanlePreviusStep}>&lt; previus</button>
        } 
        {currentPageStep}                       
    </div>
  )
}

export default Form_Signup_info