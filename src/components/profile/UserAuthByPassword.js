import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import {yupResolver} from "@hookform/resolvers/yup"
import validateSchemas from '../../helpers/validateSchema'
import { useNavigate, useParams } from 'react-router-dom'
import {useDispatch , useSelector} from 'react-redux'
import { useMutation } from 'react-query'
import { checkPassword } from '../../helpers/requests'
import { useEffect } from 'react'
import { setUpdataingProcess } from '../../redux/userSlice'
import { GridLoader } from 'react-spinners'


function UserAuthByPassword() {
  const [passwordErrorFromServer , setPasswordErorr] = useState('')
  const userInfo = useSelector(state => state.user.userInformation)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {target} = useParams()
   
  const isPasswordRight = useMutation(checkPassword ,{
    onSuccess:(data , variables , context)=>{
      if(data.isMatch == true){
        dispatch(setUpdataingProcess({passwordOrOTPMatched:true}))
        if(target == "key_update_phone") navigate(`auth_app/dashboard/user/profile/reset_phone` , {replace:true})
        if(target == "key_update_email") navigate(`auth_app/dashboard/user/profile/reset_email` , {replace:true})        
      }else{
        setPasswordErorr(data.message)
      }            
    }   
  })
  
  const {register ,handleSubmit, formState:{errors}} = useForm({
    resolver : yupResolver(validateSchemas.schemaPasswordForLogin)
  })
  
  useEffect(()=>{
    if(userInfo.user_update_process.isRunning==false){
      navigate('auth_app/dashboard/user/profile')
    }   
  },[])

  const submitPassword = (data)=>{
    setPasswordErorr("")
    isPasswordRight.mutate({user_id:userInfo.user_id , password:data.password})
  }
  
  if(isPasswordRight.isLoading){
    return (
      <div className='recognize-user'>
        <GridLoader color='rgb(181, 50, 115)'/>
      </div>
    )
  }

  return (      
    <form onSubmit={handleSubmit(submitPassword)} className='form_entry'>
      {passwordErrorFromServer != "" &&
      <p className='error_form_alert'>{passwordErrorFromServer}</p>}
      <article className='form_entry_article'>
        <label htmlFor='pass' className='form_entry_label'>Inter your password :</label>
        <input type='password' className='form_entry_input_text'
          {...register('password')} id='pass'/>     
        {errors.password?.message && 
        <p className='error_form_alert'>{errors.password.message}</p>}     
      </article>
      
      <input type='submit' className='btn' value="Submit"/>
    </form>   
  )
}

export default UserAuthByPassword