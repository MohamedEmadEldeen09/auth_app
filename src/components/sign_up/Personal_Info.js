import React from 'react'
import { Link } from 'react-router-dom'
import {useDispatch , useSelector} from 'react-redux'
import { setPersonal } from '../../redux/userSlice'
import { useForm } from 'react-hook-form'
import {yupResolver} from "@hookform/resolvers/yup"
import validateSchemas from '../../helpers/validateSchema'
import { formatBirthDate } from '../../helpers/others'

function Personal_Info({hanleNextStep}) {

  const userInfo = useSelector(state => state.user.userInformation)
  const dispatch = useDispatch()

  const {register ,handleSubmit, formState:{errors}} = useForm({
    resolver : yupResolver(validateSchemas.schemaPersonal)
  })


  //submit form
  const handleSubmitData = (data)=>{    
    data.birth_date = formatBirthDate(data.birth_date )   
    dispatch(setPersonal(data))
    hanleNextStep()      
  }

  return (
    <form onSubmit={handleSubmit(handleSubmitData)} className='form_entry'>
      <article className='form_entry_article'>
        <label htmlFor='f_n' className='form_entry_label'>Fist Name :</label>        
        <input type='text' className='form_entry_input_text'
        defaultValue={userInfo.user_first_name} 
          {...register('first_name')}
           placeholder='First Name' id='f_n'/>
        {errors.first_name?.message && 
        <p className='error_form_alert'>{errors.first_name.message}</p>}
      </article>
    
      <article className='form_entry_article'>
        <label htmlFor='l_n' className='form_entry_label'>Last Name :</label>       
        <input type='text' className='form_entry_input_text'
        defaultValue={userInfo.user_last_name} 
          {...register('last_name')}
            placeholder='Last Name' id='l_n'/>
        {errors.last_name?.message && 
        <p className='error_form_alert'>{errors.last_name.message}</p>}
      </article>

      <article className='form_entry_article'>
        <label htmlFor='d_b' className='form_entry_label'>Date Of Birth :</label>       
        <input type='date' className='form_entry_input_text'
        defaultValue={userInfo.user_birth_date} 
           {...register('birth_date')} placeholder='Date Of Birth' id='d_b'/>
        {errors.birth_date?.message && 
        <p className='error_form_alert'>Your Date Of Birth Is Required!</p>}
      </article>

      <article className='form_entry_article form_entry_article_gender'>
        <label htmlFor='g_m' className='form_entry_label'>Male
          <input type='radio' className='form_entry_input_radio'
          defaultChecked={userInfo.user_gender == "Male" && true} 
            value="Male" {...register('gender')} id='g_m'/>
        </label>        
        
        <label htmlFor='g_f' className='form_entry_label'>Female 
          <input type='radio' className='form_entry_input_radio'
          defaultChecked={userInfo.user_gender == "Female" && true} 
            value="Female" {...register('gender')} id='g_f'/>
        </label>                       
        {errors.gender?.message && 
        <p className='error_form_alert'>{errors.gender.message}</p>}
      </article>
       
     
      <article className='form_note'>
        <h4>Already have an account? go to 
          <Link to='auth_app/recognize/key_user/log_in' 
          className="form_note_link"> LogIn Page</Link></h4>        
      </article>
       
      
    <input type='submit' className='btn' value="Submit"/>     
    </form>
  )
}

export default Personal_Info