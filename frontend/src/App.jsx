import React from 'react'
import Home from './pages/Home'
import Footer from './components/common/Footer'
import Navbar from './components/common/Navbar'
import Login from './pages/Login'
import Signup from './pages/Signup'
import VerifyEmail from './pages/VerifyEmail'
import ForgotPassword from './pages/ForgotPassword'
import UpdatePassword from './pages/UpdatePassword'


function App() {
  return (
    <div className='flex min-h-screen w-screen flex-col bg-richblack-900 font-inter'>

      <Navbar />
      {/* <Home/> */}
      <Login/>
      <Signup/>
      <VerifyEmail/>
      <ForgotPassword/>
      <UpdatePassword/>
    </div>
  )
}

export default App