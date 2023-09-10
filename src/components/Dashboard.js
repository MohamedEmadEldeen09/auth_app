import React from 'react'
import { useMutation, useQuery } from 'react-query'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { getUser, logout } from '../helpers/requests'
import { useDispatch, useSelector } from 'react-redux'
import { setLogout, setUserFromPasswordStep } from '../redux/userSlice'
import { GridLoader } from 'react-spinners';

function Dashboard() {
  const userInfo = useSelector(state => state.user.userInformation)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const logoutFromTheApp = useMutation(logout , {
    onSuccess : ()=>{
      dispatch(setLogout())
      navigate('auth_app/recognize/key_user/log_in')
    }
  })
 
  //protect route
  //get user if he logged in
  const {isLoading , isError , error , data} = useQuery(['get_logged_user'],getUser,{
    onSuccess : (data)=>{
      // if he already logged in
      if(data?.user != null){
        dispatch(setUserFromPasswordStep(data.user))                
      }
      else{
        // //if user forget his password
        if(userInfo.user_update_process.forgetOrResetPassword == true){
          return navigate("auth_app/dashboard/user/profile/otp")
        }
        
        //if he does not log in yet 
        navigate('auth_app/recognize/key_user/log_in')
      }      
    },
  })
  //


  if(isLoading || logoutFromTheApp.isLoading){
    return(
      <div className='recognize-user'>
        <GridLoader color='rgb(181, 50, 115)'/>
      </div>
    ) 
  }

  if(isError){
    return(
      <div className='recognize-user'>
        <p>{error}</p>
      </div>
    ) 
  }

  const submitLogout = ()=>{
    logoutFromTheApp.mutate()
  }

  return (
    <div className='dashboard_ccontainer'>    

      <div className='navigation'>
        <div className='logo'>
          <h3>Talks App</h3>
        </div>    

        <nav className='pages-routes'>
          <NavLink className='nav-bar-link' to="auth_app/dashboard/home">Home</NavLink>
          <NavLink className='nav-bar-link' to="auth_app/dashboard/user/profile">Profile</NavLink>
          <NavLink className='nav-bar-link' to="auth_app/dashboard/friends">Freinds</NavLink>
          <NavLink className='nav-bar-link' to="auth_app/dashboard/chat">Chat</NavLink>
          <NavLink className='nav-bar-link' to="auth_app/dashboard/rooms">Rooms</NavLink>
          <NavLink className='nav-bar-link' to="auth_app/dashboard/people">People</NavLink>
        </nav>

        <div className="logout">
           <button onClick={submitLogout} className='btn logout-btn'>Log out</button>
        </div>        
      </div>
      
      <main className='content-page'>
        <header className="content-page-header">
          <div className='user-info-header-link'>
            <Link to="auth_app/dashboard/user/profile" className='user-header-name'>
                {`${userInfo.user_first_name} ${userInfo.user_last_name}`}</Link>
            <img src={`${process.env.REACT_APP_SERVER_URL}/user/get_profile_avatar/${userInfo.user_id}`}
              className='profile-avatar-header-link' alt='profile_avatar'/>
          </div>
            
        </header>
        <div className='current-page'>        
          <Outlet />
        </div>
        <footer className="footer">
            <p>Mohamed Emad</p>
            <p>Talks App copy right &copy; 2023</p>
        </footer>
      </main> 
    </div>
  )
}

export default Dashboard