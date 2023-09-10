import { createSlice} from '@reduxjs/toolkit'


const initState = {
  userInformation : {
    user_id:null,
    user_first_name:"",
    user_last_name:"",
    user_email:"",
    user_password:"",
    user_phone_national:"",
    user_phone_international : "",
    user_phone_country_code : "",
    user_birth_date:"",
    user_profile_avatar:"",
    user_gender:"",
    user_phone_verified:0,
    user_email_verified:0,
    user_isLoggedIn:false,
    user_profile_avatar_url:"",
    user_temporary_token:"",
    user_update_process:{
      passwordOrOTPMatched:false,
      isRunning:false,
      key:"",
      forgetOrResetPassword:false
    }
  }
}
const userSlice = createSlice({
 name:"user",
 initialState:initState,
 reducers:{
    //signup process
    setPersonal : (state , action)=>{
      state.userInformation.user_first_name = action.payload.first_name
      state.userInformation.user_last_name = action.payload.last_name
      state.userInformation.user_gender = action.payload.gender
      state.userInformation.user_birth_date = action.payload.birth_date
    },
    setPhone : (state , action)=>{
     state.userInformation.user_phone_national = action.payload.national
     state.userInformation.user_phone_international = action.payload.international
     state.userInformation.user_phone_country_code = action.payload.country_code
    },
    setLoginDetails :(state , action)=>{
      state.userInformation.user_email = action.payload.email
      state.userInformation.user_password = action.payload.password
    },

    //Login Process
    setUserFromEmailStep : (state , action)=>{
      state.userInformation.user_id = action.payload.user_id
      state.userInformation.user_email = action.payload.user_email
    },
    setUserFromPasswordStep : (state , action)=>{
      state.userInformation.user_first_name = action.payload.user_first_name
      state.userInformation.user_last_name = action.payload.user_last_name
      state.userInformation.user_gender = action.payload.user_gender
      state.userInformation.user_birth_date = action.payload.user_birth_date
      state.userInformation.user_id = action.payload.user_id
      state.userInformation.user_email = action.payload.user_email
      state.userInformation.user_phone_national = action.payload.user_phone_national
      state.userInformation.user_phone_international = action.payload.user_phone_international
      state.userInformation.user_phone_country_code = action.payload.user_phone_country_code
      state.userInformation.user_email_verified= action.payload.user_email_verified
      state.userInformation.user_phone_verified= action.payload.user_phone_verified
      state.userInformation.user_profile_avatar_url 
      =`${process.env.REACT_APP_SERVER_URL}/user/get_profile_avatar/${state.userInformation.user_id}` 
      state.userInformation.user_isLoggedIn = true     
      state.userInformation.user_update_process.passwordOrOTPMatched=false
      state.userInformation.user_update_process.isRunning=false
      state.userInformation.user_update_process.forgetOrResetPassword=false
    },
    setLogout : (state , action)=>{
      state.userInformation.user_isLoggedIn = false
      state.userInformation.user_first_name = ''
      state.userInformation.user_last_name = ''
      state.userInformation.user_gender = ''
      state.userInformation.user_birth_date = ''
      state.userInformation.user_id = ''
      state.userInformation.user_email = ''
      state.userInformation.user_phone_national = ''
      state.userInformation.user_phone_international = ''
      state.userInformation.user_phone_country_code = ''
      state.userInformation.user_email_verified= 0
      state.userInformation.user_phone_verified= 0
      state.userInformation.user_update_process.passwordOrOTPMatched=false
      state.userInformation.user_update_process.isRunning=false
      state.userInformation.user_update_process.key=""
      state.userInformation.user_update_process.forgetOrResetPassword=false
      //the default profile image because th user logged out or deleted his account
      state.userInformation.user_profile_avatar_url 
      =`${process.env.REACT_APP_SERVER_URL}/user/get_profile_avatar/0` 
      //    
    },
    //
   
    //profile
    setToken:(state , action)=>{
        state.userInformation.user_temporary_token = action.payload
    },
    setUpdataingProcess : (state , action)=>{
      if(action.payload.passwordOrOTPMatched){
        state.userInformation.user_update_process.passwordOrOTPMatched = 
        action.payload.passwordOrOTPMatched
      }
      if(action.payload.isRunning){
        state.userInformation.user_update_process.isRunning = action.payload.isRunning
      }
      if(action.payload.key){
        state.userInformation.user_update_process.key = action.payload.key
      }    
      if(action.payload.forgetOrResetPassword){
        state.userInformation.user_update_process.forgetOrResetPassword=
        action.payload.forgetOrResetPassword
      } 
    }
 }
})

export const {setPersonal , setPhone , setLoginDetails,
  setUserFromEmailStep,setUserFromPasswordStep,setLogout,setToken
,setUpdataingProcess} = userSlice.actions
export default userSlice.reducer