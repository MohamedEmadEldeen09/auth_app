
import * as yup from "yup"


//sign up
const schemaPersonal = yup.object().shape({
    first_name: yup.string().matches(/^[a-zA-Z\-]+$/ , "Inter A Valid Name")
    .required('Your First Name Is Required!'),
    last_name: yup.string().matches(/^[a-zA-Z\-]+$/ , "Inter A Valid Name")
    .required('Your Last Name Is Required!'),
    gender:yup.string().required('Your Gender Is Required!'),
    birth_date:yup.date().required('Your Date Of Birth Is Required!')
    
})

const schemaLoginDetails= yup.object().shape({
    email:yup.string().email("Inter A Valid Email").required('Your Email Is Required!'),
    password:yup.string().min(8).max(16)
    .matches(/^(?=.*[0-9])(?=.*[A-Z]+)(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/,"Your Password Is Not Valid!")
    .required('Your Password Is Required!'),
    c_password:yup.string().oneOf([yup.ref('password') , null] ,"Password Does Not Match!"),
})
//


//login process
const schemaEmailForLogin = yup.object().shape({
    email:yup.string().email("Inter A Valid Email").required('Your Email Is Required!')
})
const schemaPasswordForLogin = yup.object().shape({   
    password:yup.string().min(8).max(16)
    .matches(/^(?=.*[0-9])(?=.*[A-Z]+)(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/,"Your Password Is Not Valid!")
    .required('Your Password Is Required!')
})
//

//profile
const schemaProfileFnLnBd =  yup.object().shape({
    first_name: yup.string().matches(/^[a-zA-Z\-]+$/ , "Inter A Valid Name")
    .required('Your First Name Is Required!'),
    last_name: yup.string().matches(/^[a-zA-Z\-]+$/ , "Inter A Valid Name")
    .required('Your Last Name Is Required!'),
    birth_date:yup.date().required('Your Date Of Birth Is Required!')
})

const schemaProfileResetPassword =  yup.object().shape({
    password_new:yup.string().min(8).max(16)
    .matches(/^(?=.*[0-9])(?=.*[A-Z]+)(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/,"Your Password Is Not Valid!")
    .required('Your Password Is Required!'),
    c_password_new:yup.string().oneOf([yup.ref('password_new') , null] ,"Password Does Not Match!"),
})
//



const validateSchemas={schemaPersonal,schemaLoginDetails
    ,schemaProfileFnLnBd,schemaEmailForLogin,schemaPasswordForLogin
    ,schemaProfileResetPassword}

export default validateSchemas