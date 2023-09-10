import React from 'react'
import { Link } from 'react-router-dom'


function EmailVerificationFailed() {

  return (
    <div className='form_entry'>
        <label className='form_entry_label'>
          it looks like there is an error with your email
        </label>
        <label className='form_entry_label'>
          try send verification link again or go to your profile
          and change your email to be a valid one
        </label>
       <Link to="auth_app/dashboard/user/profile">Home</Link>
    </div>
  )
}

export default EmailVerificationFailed