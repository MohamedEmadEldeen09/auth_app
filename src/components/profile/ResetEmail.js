import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import {yupResolver} from "@hookform/resolvers/yup"
import validateSchemas from '../../helpers/validateSchema'
import { useNavigate } from 'react-router-dom'
import { useSelector} from 'react-redux'
import { useMutation } from 'react-query'
import { changeEmail } from '../../helpers/requests'
import { useEffect } from 'react'
import { GridLoader } from 'react-spinners'
import { useRefreshUser } from '../../helpers/others'

function ResetEmail() {
    const [emailErrorFromServer , setEmailErorr] = useState('')

    //for refresh user
    const [enableRefrishingUser , setEnableRefresh] = useState(false)
    //custom hook
    const getRefreshedUser = useRefreshUser(enableRefrishingUser)   
    //

    const userInfo = useSelector(state => state.user.userInformation)
    const navigate = useNavigate()

    const patchEmailChange = useMutation(changeEmail ,{
      onSuccess:(data , variables , context)=>{
        if(!data?.error){
          setEnableRefresh(true)
        }else{
          setEmailErorr(data.error)
        }
      }   
    })
  
    const {register ,handleSubmit, formState:{errors}} = useForm({
      resolver : yupResolver(validateSchemas.schemaEmailForLogin)
    })
    
    useEffect(()=>{
      if(userInfo.user_update_process.isRunning==false ||
        userInfo.user_update_process.passwordOrOTPMatched==false){
        navigate('auth_app/dashboard/user/profile')
      }        
    },[])

    const submitEmail = (data)=>{
      setEmailErorr('')
      patchEmailChange.mutate({user_id:userInfo.user_id , newEmail:data.email})
    }
    
    if(patchEmailChange.isLoading || getRefreshedUser.isLoading){
      return (
        <div className='recognize-user'>
          <GridLoader color='rgb(181, 50, 115)'/>
        </div>
      )
    }

    return (     
      <form onSubmit={handleSubmit(submitEmail)} className='form_entry'>
        {emailErrorFromServer!="" &&
        <p className='error_form_alert'>{emailErrorFromServer}</p>}
        <article className='form_entry_article'>
          <label htmlFor='em' className='form_entry_label'>Inter your new Email :</label>
              <input type='email' className='form_entry_input_text'
              {...register('email')} id='em'/>
              {errors.email?.message && 
              <p className='error_form_alert'>{errors.email.message}</p>}             
        </article>
        
        <input type='submit' className='btn' value="Submit"/>
      </form>
    )
}

export default ResetEmail