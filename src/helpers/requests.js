import axios from "axios"

axios.defaults.withCredentials = true
const serverUrl = process.env.REACT_APP_SERVER_URL

//--------profile--------------
//change first_name or last_name or date_of_birth or change all
export const changeOrFnOrLnOrDbOrAll =async (newInf)=>{
   const {changes , user_id} = newInf
   return (await axios.patch(`${serverUrl}/user/profile/Fname_Lname_date` 
   , {user_id,changes })).data  
}

//getOTP value by sending it by email 
export const sendOTP =async ({user_id})=>{
    return (await axios.post(`${serverUrl}/user/profile/send_otp`,{
      user_id})).data             
}

//post otp value
export const postOTP =async ({user_id, token , otpValue  , target , user_password})=>{
   return (await axios.post(`${serverUrl}/user/profile/submit_otp`
      ,{user_id , token, otpFromUserInput:otpValue , target , user_password})).data
}

//check if user inter his password right or not for more authontication 
export const checkPassword =async ({user_id , password})=>{
   return (await axios.post(`${serverUrl}/user/profile/check_password`, 
   {user_id , password })).data
}

//change password
export const changePassword =async ({user_id , oldPassword , newPassword})=>{
  return (await axios.patch(`${serverUrl}/user/profile/reset_password`,
    {user_id , newPassword })).data
}

//change phone
export const changePhone =async ({user_id , phone})=>{
   return (await axios.post(`${serverUrl}/user/profile/reset_phone`,
    { user_id , phone })).data
}

//change email
export const changeEmail =async ({user_id,newEmail})=>{
   return (await axios.patch(`${serverUrl}/user/profile/reset_email`,{user_id,newEmail})).data
}

//delete user account
export const deleteAccount =async (user_id)=>{
   return (await axios.delete(`${serverUrl}/user/delete_account/${user_id}`)).data
}
//----------------------------------------------------

//------------user authontication-----------
//get user by email to check that the email is unique for signup process
export const getUserByEmail =async (email)=>{
  return (await axios.post(`${process.env.REACT_APP_SERVER_URL}/user/get_user_by_email`
  ,{email})).data
}
//

//get user if he logged in
export const getUser =async ()=>{
 return (await axios.get(`${process.env.REACT_APP_SERVER_URL}/user/auth/get_user`)).data
}
//

//submit login process
export const submitEmailPassword =async ({email,password})=>{
   return (await axios.post(`${process.env.REACT_APP_SERVER_URL}/user/auth/login` 
   ,{email,password})).data
}
//

//logout
export const logout =async ()=>{
   return (await axios.get(`${serverUrl}/user/auth/logout`)).data
}
//
//----------------------------------------------------

//------------signup process---------------
export const registerUser =async (user)=>{
  return (await axios.post(`${process.env.REACT_APP_SERVER_URL}/user`,user)).data
}
//