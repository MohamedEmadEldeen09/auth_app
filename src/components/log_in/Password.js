import React, {useState} from 'react'
import {useMutation} from "react-query"
import axios from 'axios'
import { useForm } from 'react-hook-form'
import {yupResolver} from "@hookform/resolvers/yup"
import validateSchemas from '../../helpers/validateSchema'
import {useDispatch , useSelector} from 'react-redux'
import { useNavigate} from 'react-router-dom'
import { setToken, setUpdataingProcess, setUserFromPasswordStep } from '../../redux/userSlice'
import { sendOTP, submitEmailPassword } from '../../helpers/requests'
import { GridLoader } from 'react-spinners'


axios.defaults.withCredentials = true

function Password() {
  const userInfo = useSelector(state => state.user.userInformation)
  const [errorFromResponse , setError] = useState("")

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const postLoggingData = useMutation(submitEmailPassword , {
    onSuccess : (data , variables , context)=>{
      if(data.isLogged){       
        dispatch(setUserFromPasswordStep(data.user))
        navigate('auth_app/dashboard/user/profile',{replace:true})       
      }

      if(!data.isLogged && data.message){
        setError(data.message)
      }
   
      if(!data.isLogged && data.error){
        setError(data.error)
      }
    }
  })
  
  //send otp when forget password
  const sendingOTPbyEmail = useMutation(sendOTP , {
    onSuccess:(data , variables , context)=>{
      if(data.token){
        dispatch(setToken(data.token))   
        navigate("auth_app/dashboard/user/profile/otp")
      }
      else{
        navigate('auth_app/recognize/key_user/email_verify_failed')
      }
     }    
  })
  //

  const {register, handleSubmit , formState:{errors}} = useForm({
    resolver : yupResolver(validateSchemas.schemaPasswordForLogin)
  })

  const handleSubmitEmailAndPassword = (data)=>{
    if(errorFromResponse!=""){
      setError("")
    }    
    postLoggingData.mutate({
        email:userInfo.user_email,
        password:data.password
    })   
  }
 
  //forget password
  const handleForgetPassword = (e)=>{
    dispatch(setUpdataingProcess({isRunning:true,key:e.target.id
      ,forgetOrResetPassword:true}))
    sendingOTPbyEmail.mutate({user_id:userInfo.user_id})
  }
  //
  
  if(sendingOTPbyEmail.isLoading){
    return(
      <div className='loading'>
        <GridLoader color='rgb(181, 50, 115)'/>
      </div>
    ) 
  }

  if(postLoggingData.isLoading){
    return(
      <div className='loading'>
        <GridLoader color='rgb(181, 50, 115)'/>
      </div>
    ) 
  }

  return (
    <div className='login_entry'>
      <div className='avatar'>
          <img src={`${process.env.REACT_APP_SERVER_URL}/user/get_profile_avatar/${userInfo.user_id}`}
          className='profile_image' alt='profile_avatar'/>
      </div>     

      <form onSubmit={handleSubmit(handleSubmitEmailAndPassword)} className='form_entry'>  
        {errorFromResponse!="" && 
        <p className='error_form_alert'>{errorFromResponse}</p>}   
           
        <article className='form_entry_article'>
          <label htmlFor='pass' className='form_entry_label'>Password :</label>
            <input type='password'  className='form_entry_input_text'
            {...register("password")} placeholder='*******' id='pass'/>        
        </article>
        {errors.password?.message && 
        <p className='error_form_alert'>{errors.password.message}</p>}   
      
        <article className='form_note'>
          <p>forget your password?  
          <button onClick={handleForgetPassword} type='button' 
           className="btn-reset-password" 
            id='key_reset_password'> Reset password</button>             
          </p>        
        </article>

        <input type="submit" className='btn'/>       
      </form>  
    </div>
  )
}

export default Password