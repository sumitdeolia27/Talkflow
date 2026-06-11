import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import { Outlet, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Loading from '../components/Loading'
import { useSelector } from 'react-redux'
import { auth } from '../config/firebase'

const Layout = () => {

    const { value: user, error } = useSelector((state)=>state.user)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const { pathname } = useLocation()
    const isChatRoute = pathname.startsWith('/messages/')

  return user ? (
    <div className='w-full flex h-screen'>

        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>

        <div className='flex-1 overflow-hidden bg-slate-50'>
            <TopBar />
            <div className={`h-[calc(100vh-4rem)] ${isChatRoute ? 'overflow-hidden' : 'overflow-y-auto'}`}>
            <Outlet />
            </div>
        </div>
      {
        sidebarOpen ? 
        <X className='absolute top-3 right-3 p-2 z-100 bg-white rounded-md shadow w-10 h-10 text-gray-600 sm:hidden' onClick={()=> setSidebarOpen(false)}/>
        : 
        <Menu className='absolute top-3 right-3 p-2 z-100 bg-white rounded-md shadow w-10 h-10 text-gray-600 sm:hidden' onClick={()=> setSidebarOpen(true)}/>
      }
    </div>
  ) : (
    <div className='min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 px-6 text-center'>
      {error ? (
        <>
          <p className='text-lg font-semibold text-slate-900'>Could not load your profile</p>
          <p className='max-w-xl text-sm text-slate-600'>{error}</p>
          <button
            onClick={() => auth.signOut()}
            className='rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700'
          >
            Sign out
          </button>
        </>
      ) : (
        <Loading />
      )}
    </div>
  )
}

export default Layout
