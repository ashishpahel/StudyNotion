import React from 'react'
import Home from './pages/Home'
import Footer from './components/common/Footer'
import Navbar from './components/common/Navbar'


function App() {
  return (
    <div className='flex min-h-screen w-screen flex-col bg-richblack-900 font-inter'>

      <Navbar />
      <Home/>
    </div>
  )
}

export default App