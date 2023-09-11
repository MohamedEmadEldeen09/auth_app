import {QueryClient , QueryClientProvider, useQuery} from "react-query"
import {createBrowserRouter , createRoutesFromElements , 
  Route, RouterProvider} from "react-router-dom"

//components
//registration and entry pages
import Entry from "./components/Entry";
import Form_Login_Info from "./components/common/Form_Login_Info";
import Form_Signup_info from "./components/common/Form_Signup_info";
import ThankYouForSignup from "./components/sign_up/ThankYouForSignup";
import EmailVerificationFailed from "./components/sign_up/EmailVerificationFailed";

//page not found
import NotFound from "./components/NotFound";

//dashboard and dashboard pages
import Dashboard from "./components/Dashboard";
import People from "./components/dashboard/People";
import Friends from "./components/dashboard/Friends";
import Rooms from "./components/dashboard/Rooms";
import Chat from "./components/dashboard/Chat";
import Home from "./components/dashboard/Home";
//profile
import Profile from "./components/dashboard/Profile";
import OTP_input from "./components/profile/OTP_input";
import ResetPassword from "./components/profile/ResetPassword";
import ResetEmail from "./components/profile/ResetEmail";
import ResetPhone from "./components/profile/ResetPhone";
import UserAuthByPassword from "./components/profile/UserAuthByPassword";

//manage main route
import RedirectedPage from "./components/RedirectedPage";

const queryClient = new QueryClient();

//Routes
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route path="/auth_app" element={<RedirectedPage />}/>
    <Route path="/auth_app/recognize/key_user" element={<Entry />}>
      <Route path="log_in" element={<Form_Login_Info />} />
      <Route path="sign_up" element={<Form_Signup_info />} />
      <Route path="finish_signup" element={<ThankYouForSignup />} />   
      <Route path="email_verify_failed" element={<EmailVerificationFailed />} /> 
      <Route path="reset_password" element={<ResetPassword />} />     
    </Route>    
    <Route path="/auth_app/dashboard" element={<Dashboard />}>
      <Route index element={<Home />} />
      <Route path="home" element={<Home />} />
      <Route path="user/profile" element={<Profile />} />
      <Route path="user/profile/otp" element={<OTP_input />} />
      <Route path="user/profile/reset_email" element={<ResetEmail />} />
      <Route path="user/profile/reset_phone" element={<ResetPhone />} />
      <Route path="user/profile/password_auth/:target" element={<UserAuthByPassword />} />
      <Route path="people" element={<People />} />
      <Route path="friends" element={<Friends />} />
      <Route path="rooms" element={<Rooms />} />
      <Route path="chat" element={<Chat />} />
    </Route>   
    <Route path="*" element={<NotFound />} />
    </>
  )
)
//


function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
