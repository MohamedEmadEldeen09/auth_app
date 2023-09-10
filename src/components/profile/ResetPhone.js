import React, { useEffect, useState } from 'react'
import { useSelector} from 'react-redux'
import 'react-phone-number-input/style.css'
import PhoneInput , 
{formatPhoneNumber,isPossiblePhoneNumber,parsePhoneNumber,isValidPhoneNumber,formatPhoneNumberIntl} 
from 'react-phone-number-input'
import { useMutation } from 'react-query'
import { changePhone } from '../../helpers/requests'
import { useNavigate } from 'react-router-dom'
import { GridLoader } from 'react-spinners'
import { useRefreshUser } from '../../helpers/others'

function ResetPhone() {
  const [value , setValue] = useState("")
  const [phoneError , setPhoneError] = useState("")
 
  //for refresh user
  const [enableRefrishingUser , setEnableRefresh] = useState(false)
  //custom hook
  const getRefreshedUser = useRefreshUser(enableRefrishingUser)
  //

  const navigate = useNavigate()
  const userInfo = useSelector(state => state.user.userInformation)
  
  const patchPhoneChange = useMutation(changePhone , {
    onSuccess:(data , variables , context)=>{
      if(!data?.error){
        setEnableRefresh(true)
      }else{
        setPhoneError(data.error)
      }
    } 
  })
 

 useEffect(()=>{
  if(userInfo.user_update_process.isRunning==false ||
    userInfo.user_update_process.passwordOrOTPMatched==false){
    navigate('auth_app/dashboard/user/profile')
  } 

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
  
  const phone = {
    user_phone_national : formatPhoneNumber(value),
    user_phone_international : formatPhoneNumberIntl(value),
    user_phone_country_code : (parsePhoneNumber(formatPhoneNumberIntl(value))).country
  }
  patchPhoneChange.mutate({user_id:userInfo.user_id , phone}) 
}

if(patchPhoneChange.isLoading || getRefreshedUser.isLoading){
  return (
    <div className='recognize-user'>
      <GridLoader color='rgb(181, 50, 115)'/>
    </div>
  )
} 

  return (   
   <div className='form_entry'>
     {phoneError != "" && <p className='error_form_alert error_phone'>{phoneError}</p>}
    <label className='form_entry_label'>Inter your new Phone Number :</label>
    <PhoneInput   
    className='input_phone'
    defaultCountry={userInfo.user_phone_country_code==""? 'US':userInfo.user_phone_country_code}    
    international
    value={value}
    onChange={handlePhoneInputChange}/>     
    <button type='button' className='btn' onClick={hanleSubmitPhone}>Submit</button>
   </div>      
  )
}

export default ResetPhone