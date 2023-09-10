import React, {useState } from 'react'
import { useDispatch , useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import {yupResolver} from "@hookform/resolvers/yup"
import validateSchemas from '../../helpers/validateSchema'
import { useNavigate } from 'react-router-dom'
import { useMutation } from 'react-query'
import { changeOrFnOrLnOrDbOrAll, deleteAccount, logout, sendOTP } from '../../helpers/requests'
import { formatBirthDate, useRefreshUser } from '../../helpers/others'
import { setLogout, setToken, setUpdataingProcess } from '../../redux/userSlice'
import { GridLoader } from 'react-spinners'
import { useEffect } from 'react'


function Profile() { 
    //to manage profile picture
    const [profile_avatar , setProfileAvatar] = useState('')
    //

    //to manage edit button
    const [allwoToEdit , setAllowToEdit] = useState('')
    //
    
    //for refresh user
    const [enableRefrishingUser , setEnableRefresh] = useState(false)
    //custom hook
    const getRefreshedUser = useRefreshUser(enableRefrishingUser)
    //

    //error of response from first_name or last_name or date_of_birth update
    const [errorPatchFnLnBd , setErrorPatchFnLnBd] = useState('')
    //

    const userInfo = useSelector(state => state.user.userInformation)
    const dispatch = useDispatch()

    const navigate = useNavigate()   

    //mutaion for change first_name or last_name or date_of_birth or change all 
    const patchFnameLnameBirthDate = useMutation(changeOrFnOrLnOrDbOrAll,{
        onSuccess:(data , variables , context)=>{           
            if(data?.error){
               setErrorPatchFnLnBd(data.error)            
            }else{
               setEnableRefresh(true)           
            }
        }
    })
    //
    
    //mutation for send otp
    const sendingOTPbyEmail = useMutation(sendOTP , {
    onSuccess:(data , variables , context)=>{
      if(data.token){
        dispatch(setToken(data.token))   
        navigate("auth_app/dashboard/user/profile/otp")
      }
      else{
        navigate('auth_app/recognize/key_user/email_verify_failed')
      }
     }    
    })
    //
    
    //mutation for log out when remove account
    const logoutFromTheApp = useMutation(logout , {
        onSuccess : (data , variables , context)=>{               
          closeTheUserAccount.mutate(userInfo.user_id)
        }
    })
    //

    //mutaion for delete the account
    const closeTheUserAccount = useMutation(deleteAccount,{
        onSuccess:(data , variables , context)=>{          
          dispatch(setLogout())
          navigate('auth_app/recognize/key_user/sign_up')                 
        }
    })
    //

    const {register,handleSubmit, formState:{errors}} = useForm({
        resolver : yupResolver(validateSchemas.schemaProfileFnLnBd),
        defaultValues:{
            first_name:userInfo.user_first_name,
            last_name:userInfo.user_last_name,
            birth_date:userInfo.user_birth_date,
        }
    })
    
    //the profile must not mount when reset password process is running 
    useEffect(()=>{
        if(userInfo.user_update_process.isRunning == true){
           navigate('auth_app/dashboard/user/profile/otp')  
        }      
    },[])
    //

    //open the disable input
    const openToEdit = (e)=>{
        let targetId =  (e.target.id).substring(4 ,(e.target.id).length)
        setAllowToEdit(targetId)
    }
  
    //save changes **first_name - last_name - birth_date** 
    const submitFnLnDbChanges = (data)=>{
        let changes = {}
        if(data.first_name !== userInfo.user_first_name){
            changes.user_first_name = data.first_name
        }
        if(data.last_name !== userInfo.user_last_name){
            changes.user_last_name = data.last_name
        }       
        data.birth_date = formatBirthDate( data.birth_date)
        if(data.birth_date !== userInfo.user_birth_date){
            changes.user_birth_date = data.birth_date
        }   
       
        if(Object.keys(changes).length != 0){ 
            setAllowToEdit('')    
            patchFnameLnameBirthDate.mutate({changes , user_id:userInfo.user_id})
            changes={}
        }else{
            setAllowToEdit('') 
        }        
    }
  
    //delete the account
    const handleDeleteAccount = ()=>{
      const messageConfirm = confirm('are you sure you want to close your account')
      if(messageConfirm){
        logoutFromTheApp.mutate() 
      }
    } 
    //

    const handleProcessEditOrVerify = (e)=>{
        dispatch(setUpdataingProcess({isRunning:true , key:e.target.id}))
        if(e.target.id == 'email_edit_btn'){                
          navigate("auth_app/dashboard/user/profile/password_auth/key_update_email")
        }       
        if(e.target.id == 'key_verify_email' || e.target.id == 'key_reset_password'){                           
          sendingOTPbyEmail.mutate({user_id:userInfo.user_id})           
        }       
       if(e.target.id == 'phone_edit_btn'){          
          navigate("auth_app/dashboard/user/profile/password_auth/key_update_phone")
        }
    } 

    if(getRefreshedUser.isLoading || logoutFromTheApp.isLoading 
        || closeTheUserAccount.isLoading || patchFnameLnameBirthDate.isLoading
        || sendingOTPbyEmail.isLoading){
        return(
          <div className='loading'>
            <GridLoader color='rgb(181, 50, 115)'/>
          </div>
        ) 
    }

  return (
    <div className='profile-page'>
        {/* profile image */}
        <div className='profile-avatar profile-card'>
         <img src={userInfo.user_profile_avatar_url!=""? 
            userInfo.user_profile_avatar_url:profile_avatar} 
             className='profile_image' alt='profile_avatar'/>
          <form  method='post'           
          action={`${process.env.REACT_APP_SERVER_URL}/user/upload_profile_avatar/${userInfo.user_id}`} 
          encType="multipart/form-data"
          >
            <label htmlFor="profile-img">
                <input type="file" 
                name="profile_avatar" 
                value={profile_avatar}
                onChange={(e)=>setProfileAvatar(e.target.value)}
                id="profile-img" accept="/image/*"/>
            </label>

            <input type='submit' value='Upload' className='btn'
            disabled={profile_avatar?false:true}/>             
          </form>
        </div>
      
        <form onSubmit={handleSubmit(submitFnLnDbChanges)} 
        className='profile-card form-profile-personal-info'>
             {getRefreshedUser.isError && 
             <p className='error_form_alert'>{getRefreshedUser.error}</p>}
            {/* first_name and last_name */}           
            <article className='form_entry_article'>
                <label htmlFor='f_n' className='form_entry_label'>First Name :</label>
                    <input type='text' {...register('first_name')} 
                    className='form_entry_input_text overload-input' id='f_n' 
                    disabled={allwoToEdit=='f_n'? false:true}/>                                  
                <button type="button" id='btn_f_n' 
                className='btn btn-edit'
                onClick={openToEdit}>Edit</button>
                {errors.first_name?.message && 
                <p className='error_form_alert'>{errors.first_name.message}</p>}

                <label htmlFor='l_n' className='form_entry_label'>Last Name :</label>
                    <input type='text' {...register('last_name')} 
                    className='form_entry_input_text overload-input' id='l_n' 
                    disabled={allwoToEdit=='l_n'? false:true}/>                                                      
                <button type="button" id="btn_l_n" 
                className='btn btn-edit'
                onClick={openToEdit}>Edit</button>
                {errors.last_name?.message && 
                <p className='error_form_alert'>{errors.last_name.message}</p>}
            </article>

            {/* date_of_birth */}
            <article className='form_entry_article'>
                <label htmlFor='d_b' className='form_entry_label'>Date Of Birth :</label>
                    <input type='date' {...register('birth_date')}
                    className='form_entry_input_text overload-input' id='d_b' 
                    disabled={allwoToEdit=='d_b'? false:true} />               
                <button type="button" id='btn_d_b' 
                className='btn btn-edit'
                onClick={openToEdit}>Edit</button>
                {errors.birth_date?.message && 
                <p className='error_form_alert'>{errors.birth_date.message}</p>}  
                {errorPatchFnLnBd != "" && 
                <p className='error_form_alert'>{errorPatchFnLnBd}</p>}             
            </article>
            

            <input type="submit" className='btn btn-save' value="Save Changes" 
            disabled={allwoToEdit!=""? false:true}/>
        </form>
          
        {/*-------------------------------------------------*/}
        {/*important data*/}
        <div className='profile-card form-profile-personal-info'>
            {/* phone */}
            <article className='form_entry_article'>
                <label htmlFor='p_n' className='form_entry_label'>Phone :</label>
                <input type='text' name='phone' 
                className='form_entry_input_text overload-input'
                id='p_n' disabled
                defaultValue={userInfo.user_phone_international}/>   
                <button 
                onClick={handleProcessEditOrVerify}
                className='btn btn-edit'
                id="phone_edit_btn">Edit</button>    
                <div className='verify-area'>
                    {
                        userInfo.user_phone_verified == 1?
                        <span className='verified'>verified</span>:
                        <>
                            <span className='not-verified'>not verified</span>
                            <button  id="key_verify_email"
                            className='btn btn-verify'
                            onClick={()=>alert('This action not available for now!')}>
                            Verify</button>
                        </>
                    }                                       
                </div>                                                  
            </article>

            {/* email */}
            <article className='form_entry_article'>
                <label htmlFor='em' className='form_entry_label'>Email :</label>
                <input type='email' id='em' disabled
                className='form_entry_input_text overload-input'
                defaultValue={userInfo.user_email}/>
                <button 
                onClick={handleProcessEditOrVerify} 
                className='btn btn-edit'
                id="email_edit_btn">Edit</button> 

                <div className='verify-area'>
                    {
                        userInfo.user_email_verified == 1?
                        <span className='verified'>verified</span>:
                        <>
                            <span className='not-verified'>not verified</span>
                            <button onClick={handleProcessEditOrVerify} 
                            id="key_verify_email" className='btn btn-verify'>Verify</button>
                        </>                      
                    }                                                                                                
                </div>
            </article>
               
            {/* password */}
            <article className='form_entry_article'>
                <label htmlFor='pass' className='form_entry_label'>Password :</label>
                    <input type='password' name='password' id='pass' disabled
                    className='form_entry_input_text overload-input'
                    placeholder='*************'/>                
                <button onClick={handleProcessEditOrVerify} 
                className='btn btn-edit'
                id="key_reset_password">Reset Password</button>
            </article>
        </div>
        
        <button type='button' className="btn btn-delete"
        onClick={handleDeleteAccount}>Delete This Account</button>
    </div>
  )
}

export default Profile