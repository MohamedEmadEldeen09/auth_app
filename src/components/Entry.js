import React from 'react'
import { useQuery } from 'react-query';
import { Outlet, useNavigate } from 'react-router-dom'
import { getUser } from '../helpers/requests';
import { GridLoader } from 'react-spinners';
import { useSelector } from 'react-redux';



function Entry() {
  const userInfo = useSelector(state => state.user.userInformation)
  const navigate = useNavigate()

  //protect route
  //get user if he logged in
  const {isLoading , isError , error , data} = useQuery(['get_logged_user'],getUser,{
    onSuccess : (data)=>{
      // if he already logged in
      if(data?.user != null && userInfo.user_update_process.forgetOrResetPassword == false){ 
        navigate('auth_app/dashboard/user/profile')    
      }    
    },
  })
  //

  if(isLoading){
    return(
      <div className='recognize-user'>
        <GridLoader color='rgb(181, 50, 115)'/>
      </div>
    ) 
  }

  if(isError){
    return <p className='recognize-user'>{error}</p>
  }

  return (
    <>
      <div className='entry_container'>
          <Outlet />      
      </div>
      <footer className="footer">
          <p>Mohamed Emad</p>
          <p>Talks App copy right &copy; 2023</p>
      </footer>
    </>
  )
}

export default Entry