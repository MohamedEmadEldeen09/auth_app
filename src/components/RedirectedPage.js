import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function RedirectedPage() {
    const route = useNavigate()
    useEffect(()=>{
        route('/auth_app/recognize/key_user/log_in')
    })
    return (
        <div>
        
        </div>
    )
}

export default RedirectedPage
