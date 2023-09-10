import axios from 'axios'
import React, {useState,useEffect} from 'react'
import { useMutation } from 'react-query'
import { useSelector} from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../../helpers/requests'
import { GridLoader } from 'react-spinners'

axios.defaults.withCredentials = true

function ThankYouForSignup() {
  const [dataResponse , setDataResponse] = useState('')
 
  const userInfo = useSelector(state => state.user.userInformation)
  
  const navigate = useNavigate()

  const addUserAndVerifyEmail = useMutation(registerUser,{
    onSuccess:(data , variables , context)=>{
      // if(data?.state_email == "failure"){
      //   setDataResponse(
      //     `${data.registration_result.message} ${data.message_email}, The email is not valid, must be a gmail account`)                                   
      // }
      // else if(data?.state_email == "success"){
      //   setDataResponse(`${data.registration_result.message}, ${data.message_email}`)          
      // }
      // else{
      //   setDataResponse(`${data.registration_result.message}`)
      // }
      
      if(data.registration_result.error){
        setDataResponse(`${data.registration_result.error}`)
      }else{       
        setDataResponse(`${data.registration_result.message}, ${data.message_email}`)      
      }                                                     
    }
  })
  
  const {user_first_name ,user_last_name,user_email,user_password,user_phone_national
    ,user_phone_international,user_phone_country_code,user_birth_date,
    user_gender ,user_phone_verified,user_email_verified} = userInfo

  useEffect(()=>{
    if(user_first_name=="" || user_last_name=="" || user_email=="" 
    || user_password=="" || user_phone_national=="" || user_phone_international=="" 
    || user_phone_country_code=="" || user_birth_date==""||user_gender=="" 
    || user_birth_date==""){
     navigate('auth_app/recognize/key_user/log_in')
    }else{
    addUserAndVerifyEmail.mutate({
      user_first_name ,user_last_name,user_email,user_password,user_phone_national
      ,user_phone_international,user_phone_country_code,user_birth_date,
      user_gender ,user_phone_verified,user_email_verified
    }) 
    } 
  },[])
  
  return (
    <div className="thank-you-for-signup">
        <p className='paragraph_note'>
          Thank you for sign up, we are sending to you a 
            verification link to your email.
        </p>
        {addUserAndVerifyEmail.isLoading && 
         <div className='loading'>
          <p className='paragraph_note'>Saving user and send email veification link.....</p>
          <GridLoader color='rgb(181, 50, 115)'/>
         </div>} 
       
        {addUserAndVerifyEmail.isError && 
        <>
        <p className='paragraph_note paragraph_note_error'>
          {addUserAndVerifyEmail.error}</p>
          <Link to="auth_app/recognize/key_user/log_in" 
          className='form_note_link'>Go to the login page</Link>
          </>
        }   

        {dataResponse!="" && <h4>{dataResponse}</h4> }          
    </div>
  )
}


export default ThankYouForSignup