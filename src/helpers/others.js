import { useQuery } from "react-query"
import { getUser } from "./requests"
import { useDispatch } from "react-redux"
import { setUserFromPasswordStep } from "../redux/userSlice"
import { useNavigate } from "react-router-dom"


export const formatBirthDate = (date)=>{
    const d = new Date(date)
    const year = d.getFullYear()
    const month =String(d.getMonth()+1).padStart(2,'0')
    const day = String(d.getDate()).padStart(2,'0')   
    const Birth_date  = `${year}-${month}-${day}`

    return Birth_date
}

//refresh user custom hook
export const useRefreshUser = (enable)=>{
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {isLoading,error,isError,data,refetch} = 
    useQuery(['refreshUerData'] , getUser , {
        onSuccess : (data)=>{
            if(data?.user != null){
              dispatch(setUserFromPasswordStep(data.user))    
              navigate('/dashboard/user/profile' , {replace:true})            
            }     
        },
        enabled : enable
    })
    return {isLoading,error,isError,data,refetch}
}