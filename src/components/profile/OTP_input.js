import React, { useEffect, useState } from 'react'
import { postOTP } from '../../helpers/requests'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setUpdataingProcess } from '../../redux/userSlice'
import { GridLoader } from 'react-spinners'
import { useRefreshUser } from '../../helpers/others'

function OTP_input() {
  const [otpValue , setOtpValue] = useState('')
  const [otpValueError , setOtpValueError] = useState('')
  const navigate = useNavigate()

  const userInfo = useSelector(state => state.user.userInformation)
  const dispatch = useDispatch()

  // //for refresh user
  const [enableRefrishingUser , setEnableRefresh] = useState(false)
  //custom hook
  const getRefreshedUser = useRefreshUser(enableRefrishingUser)
  //

  //confirm otp
  const confirmOTP = useMutation(postOTP , {
    onSuccess:(data , variables , context)=>{   
      if(data.isOtpValid == true){       
        if(userInfo.user_update_process.key == "key_verify_email"){          
          setEnableRefresh(true)               
        }
        if(userInfo.user_update_process.key == "key_reset_password") {
          dispatch(setUpdataingProcess(
            {passwordOrOTPMatched:true , forgetOrResetPassword:true,isRunning:true}))
          navigate(`auth_app/recognize/key_user/reset_password` , {replace:true})
        }
      }
      else{
        if(data.error && data.message){
          setOtpValueError(data.error)
        }
        if(data.message){
          setOtpValueError(data.message)
        }
      }
    }
  })
   
  useEffect(()=>{
    if(userInfo.user_update_process.isRunning==false){
      navigate('auth_app/dashboard/user/profile')  
    }
  },[])
  

  //handle otp value changing
  const handleOtp = (e)=>{    
    setOtpValue(e.target.value)
    setOtpValueError('')
  }

  //submit otp
  const handleSubmitdata = (e)=>{
    e.preventDefault()
    if(otpValue != '' && otpValue.length == 6){
      confirmOTP.mutate({user_id:userInfo.user_id , 
        token:userInfo.user_temporary_token , otpValue , 
        target:userInfo.user_update_process.key,
        user_password:userInfo.user_password})     
    }else{
      if(otpValue == ''){
        setOtpValueError('Code must not be empty!')
        return
      }
      if(otpValue.length > 6 && otpValue.length < 6){
        setOtpValueError('Code must be 6 numbers!')
        return
      }
    }    
  }
  
  if(confirmOTP.isLoading || getRefreshedUser.isLoading){
    return (
      <div className='recognize-user'>
        <GridLoader color='rgb(181, 50, 115)'/>
      </div>
    )
  }

  return (             
    <form onSubmit={handleSubmitdata} className='form_entry'>
        <label className='form_entry_label'>
          Inter the code that just sended to you within an email
            , this code is valid for 5 minutes!
        </label>
        <article className='form_entry_article'>
            <label htmlFor='em' className='form_entry_label'>OTP :</label>
                <input type='text' className='form_entry_input_text'
                  name='OTP_code' value={otpValue} 
                onChange={handleOtp}  id='otp'/>              
            {otpValueError!="" && 
            <p className='error_form_alert'>{otpValueError}</p>}
        </article>    

        <input type='submit' className="btn" value="Submit"/>
    </form>
  )
}

export default OTP_input