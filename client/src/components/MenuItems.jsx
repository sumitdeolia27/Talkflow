import React from 'react'
import { menuItemsData } from '../assets/assets'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'

const MenuItems = ({setSidebarOpen}) => {
  const pendingCount = useSelector((state) => state.connections.pendingConnections.length)
  const unreadMessages = useSelector((state) => state.notifications.items.filter((item) => item.type === 'message' && !item.read).length)

  return (
    <div className='px-6 text-gray-600 space-y-1 font-medium'>
      {
        menuItemsData.map(({to, label, Icon: MenuIcon})=>(
            <NavLink key={to} to={to} end={to === '/'} onClick={()=> setSidebarOpen(false)} className={({isActive})=> `px-3.5 py-2 flex items-center gap-3 rounded-xl ${isActive ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'}`}>
                <MenuIcon className="w-5 h-5"/>
                <span className='flex-1'>{label}</span>
                {label === 'Connections' && pendingCount > 0 && (
                  <span className='flex min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-xs font-semibold text-white'>
                    {pendingCount}
                  </span>
                )}
                {label === 'Messages' && unreadMessages > 0 && (
                  <span className='flex min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-xs font-semibold text-white'>
                    {unreadMessages}
                  </span>
                )}
            </NavLink>
        ))
      }
    </div>
  )
}

export default MenuItems
