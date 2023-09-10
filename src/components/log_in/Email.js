import React, { useState} from 'react'
import default_profile_image from '../../img/default_profile_image.jpg'
import { useMutation} from "react-query"
import { useForm } from 'react-hook-form'
import {yupResolver} from "@hookform/resolvers/yup"
import validateSchemas from '../../helpers/validateSchema'
import {useDispatch, useSelector} from 'react-redux'
import { setUserFromEmailStep } from '../../redux/userSlice'
import { Link } from 'react-router-dom'
import { GridLoader } from 'react-spinners';
import { getUserByEmail } from '../../helpers/requests'


function Email({hanleNextStep}) {
  const [errorFromRespose , setErrorFromResponse] = useState('')
  const userInfo = useSelector(state => state.user.userInformation)
  const dispatch = useDispatch()
  
  const findUserByEmail = useMutation(getUserByEmail , {
   onSuccess : (data , variables , context)=>{
    if(data?.user){
      const {user_email , user_id} = data.user
      dispatch(setUserFromEmailStep({user_email , user_id}))
      hanleNextStep()
    }else{
      if(data.state =='success'){
        setErrorFromResponse(data.message)
      }  
      if(data.state =='failure'){
        setErrorFromResponse(data.error)
      }
    }    
   }
  })

  const {register, handleSubmit , formState:{errors}} = useForm({
    resolver : yupResolver(validateSchemas.schemaEmailForLogin)
  })
 
  const handleSubmitEmail = (data)=>{
    findUserByEmail.mutate({email:data.email})   
  }

  if(findUserByEmail.isLoading){
    return(
      <div className='loading'>
        <GridLoader color='rgb(181, 50, 115)'/>
      </div>
    ) 
  }
  
  return (
    <div className='login_entry'>
      <div className='avatar'>
       <img src={default_profile_image} className='profile_image' alt='profile_avatar'/>
      </div>      

      <form onSubmit={handleSubmit(handleSubmitEmail)} className='form_entry'>
        {findUserByEmail.isError&&
        <p className='error_form_alert'>{findUserByEmail.error}</p>}

        {errorFromRespose!=""&&
        <p className='error_form_alert'>{errorFromRespose}</p>}

        <article className='form_entry_article'>
          <label htmlFor='em' className='form_entry_label'>Email :</label>
            <input type='email' {...register("email")}   
            defaultValue={userInfo.user_email!=""?userInfo.user_email:""}         
            className='form_entry_input_text'
            placeholder='@gmail.com' id='em'/>         
        </article>
        {errors.email?.message && 
        <p className='error_form_alert'>{errors.email.message}</p>}
        
        <article className='form_note'>
          <h4>Do not have an account?
            <Link to="/recognize/key_user/sign_up" 
            className='form_note_link'> sign up</Link></h4>
        </article>

        <input type='submit' className='btn'/>
      </form>     
    </div>
  )
}

export default Email