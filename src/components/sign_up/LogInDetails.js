import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import {yupResolver} from "@hookform/resolvers/yup"
import validateSchemas from '../../helpers/validateSchema'
import {useDispatch , useSelector} from 'react-redux'
import { setLoginDetails } from '../../redux/userSlice'
import {useNavigate } from 'react-router-dom'
import { useMutation } from 'react-query'
import { getUserByEmail } from '../../helpers/requests'


function LogInDetails() {
  const [errorEmailNotUnique , setErrorEmailUnique] = useState('')
  const route = useNavigate()

  const {register, handleSubmit , formState:{errors}} = useForm({
    resolver : yupResolver(validateSchemas.schemaLoginDetails)
  })

  const userInfo = useSelector(state => state.user.userInformation)
  const dispatch = useDispatch()

  //mutation for check that the email is unique
  const isEmailUnique = useMutation(getUserByEmail , {
    onSuccess : (data , variables , context)=>{
      console.log(data);
      if(data.user){
        setErrorEmailUnique('this email is already exist choose another email!')
      }else{        
        route('auth_app/recognize/key_user/finish_signup')
      }
    }
  })
  //

  const handleSubmitData = (data)=>{  
    dispatch(setLoginDetails({email:data.email , password:data.password}))
    isEmailUnique.mutate(data.email)
  }

  return (  
    <form onSubmit={handleSubmit(handleSubmitData)} className='form_entry'>
       <article className='form_entry_article'>
        <label htmlFor='em' className='form_entry_label'>Email :</label>
        <input type='email' className='form_entry_input_text'
        defaultValue={userInfo.user_email} 
        {...register("email")} id="em" placeholder='@gmail.com'/>        
        {errors.email?.message && 
        <p className='error_form_alert'>{errors.email.message}</p>}
       </article>

       <article className='form_entry_article'>
        <label htmlFor='pass' className='form_entry_label'>Password :</label>
          <input type='password' className='form_entry_input_text'
          defaultValue={userInfo.user_password} 
          {...register("password")} id="pass" placeholder='Strong Password'/>        
        {errors.password?.message && 
        <p className='error_form_alert'>{errors.password.message}</p>}
       </article>

       <article className='form_entry_article'>
        <label  htmlFor='c_pass' className='form_entry_label'>Confirm Password :</label>
          <input type='password' className='form_entry_input_text'
          defaultValue={userInfo.user_password} 
          {...register("c_password")} id="c_pass" placeholder='Confirm Password'/>        
        {errors.c_password?.message && 
        <p className='error_form_alert'>{errors.c_password.message}</p>}
       </article>

       {errorEmailNotUnique && 
        <p className='error_form_alert'>{errorEmailNotUnique}</p>}

       <input type='submit' className='btn'/>
    </form>   
  )
}

export default LogInDetails