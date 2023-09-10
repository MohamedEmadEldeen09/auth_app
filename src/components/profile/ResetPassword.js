import React, { useEffect , useState } from 'react'
import { useForm } from 'react-hook-form'
import {yupResolver} from "@hookform/resolvers/yup"
import validateSchemas from '../../helpers/validateSchema'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector} from 'react-redux'
import { useMutation } from 'react-query'
import { changePassword, logout } from '../../helpers/requests'
import { GridLoader } from 'react-spinners'
import { setLogout } from '../../redux/userSlice'

function ResetPassword() {
  const [errorPasswordFromServer , setErrorPassword] = useState('')
  

  const userInfo = useSelector(state => state.user.userInformation)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const logoutFromTheApp = useMutation(logout , {
    onSuccess : (data , variables , context)=>{
      dispatch(setLogout())
      navigate('auth_app/recognize/key_user/log_in' , {replace:true})
    }
  })

  const patchPasswordChange = useMutation(changePassword ,{
    onSuccess:(data , variables , context)=>{
      if(!data?.error){        
        logoutFromTheApp.mutate()
      }else{
        setErrorPassword(data.message)
      }         
    }   
  })
  
  const {register ,handleSubmit, formState:{errors}} = useForm({
    resolver : yupResolver(validateSchemas.schemaProfileResetPassword)
  })
  
  useEffect(()=>{
    if(userInfo.user_update_process.isRunning==false ||
      userInfo.user_update_process.passwordOrOTPMatched==false||
      userInfo.user_update_process.forgetOrResetPassword==false){
      navigate('auth_app/dashboard/user/profile')
    }  
  },[])

  const submitPassword= (data)=>{
    patchPasswordChange.mutate({user_id:userInfo.user_id,newPassword: data.password_new})
  }
  
  //cancel 
  const handleCancelResetPassword = ()=>{
    logoutFromTheApp.mutate()
  }
  //

  if(patchPasswordChange.isLoading || logoutFromTheApp.isLoading){
    return (
      <div className='recognize-user'>
        <GridLoader color='rgb(181, 50, 115)'/>
      </div>
    )
  }

  return (   
    <form onSubmit={handleSubmit(submitPassword)} className='form_entry'>
      {errorPasswordFromServer && 
      <p className='error_form_alert'>{errorPasswordFromServer}</p>}

      <article className='form_entry_article'>
        <label htmlFor='p_n' className='form_entry_label'>New Password :</label>
            <input type='password' className='form_entry_input_text'
            {...register('password_new')} id='p_n'/>      
        {errors.password_new?.message && 
        <p className='error_form_alert'>{errors.password_new.message}</p>}
      </article>
      
      <article className='form_entry_article'>
        <label htmlFor='c_p_o' className='form_entry_label'>Confirm New Password :</label>
            <input type='password' className='form_entry_input_text'
            {...register('c_password_new')} id='c_p_o'/>       
        {errors.c_password_new?.message && 
        <p className='error_form_alert'>{errors.c_password_new.message}</p>}
      </article>
      
      <input type='submit' className='btn' value="Submit"/>
      <input type='button' className='btn btn-cancel' 
      onClick={handleCancelResetPassword} value="Cancel"/>
    </form>
  )
}

export default ResetPassword