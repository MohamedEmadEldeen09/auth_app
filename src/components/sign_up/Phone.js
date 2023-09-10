import React, { useEffect, useState } from 'react'
import {useDispatch , useSelector} from 'react-redux'
import { setPhone } from '../../redux/userSlice'
import 'react-phone-number-input/style.css'
import PhoneInput , 
{formatPhoneNumber,isPossiblePhoneNumber,parsePhoneNumber,
  isValidPhoneNumber,formatPhoneNumberIntl} 
from 'react-phone-number-input'


function Phone({hanleNextStep , statge}) {
  const [value , setValue] = useState("")
  const [phoneError , setPhoneError] = useState("")

  const userInfo = useSelector(state => state.user.userInformation)
  const dispatch = useDispatch()

 useEffect(()=>{
   if(userInfo.user_phone_international) setValue(userInfo.user_phone_international)
   if(phoneError != "") setPhoneError("")

 },[])
 

 const handlePhoneInputChange = (value)=>{
   if(phoneError != "") setPhoneError("")
   setValue(value)
 }

const hanleSubmitPhone = ()=>{
  if(value.trim() == ""){
    setPhoneError('Your Phone is required!')
    return
  }

  if(!isPossiblePhoneNumber(value) || !isValidPhoneNumber(value)){
    setPhoneError('Your Phone is not valid!')
    return
  }
  
  
  dispatch(setPhone({
    national : formatPhoneNumber(value),
    international : formatPhoneNumberIntl(value),
    country_code : (parsePhoneNumber(formatPhoneNumberIntl(value))).country
  }))
  
  if(statge == 'sign_up_statge'){
    hanleNextStep()
  }
}

  return (   
  <div className='form_entry'>
    {phoneError != "" && <p className='error_form_alert error_phone'>{phoneError}</p>}
    <label className='form_entry_label'>Phone Number :</label>
    <PhoneInput   
    className='input_phone'
    defaultCountry={userInfo.user_phone_country_code==""? 'US':userInfo.user_phone_country_code}
    international
    value={value}
    onChange={handlePhoneInputChange}
    /> 
    <button type='button' className='btn' 
      onClick={hanleSubmitPhone}>Submit</button>
  </div>    
  )
}

export default Phone