import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Navbar from './components/Navbar'
import { MapProvider } from './contexts/MapContext'

const App = () => {
  return (
    <MapProvider>
      <div className='w-screen h-screen'>

        <Navbar />

        <div className='h-[calc(100vh-64px)]'>
          <Routes>
            <Route path='/' element={<Dashboard/>}/>
          </Routes>
        </div>
        
      </div>
    </MapProvider>
  )
}

export default App

