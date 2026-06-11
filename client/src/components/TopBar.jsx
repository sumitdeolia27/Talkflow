import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Bell, CheckCheck, MessageCircle, Moon, PhoneCall, Sun, Trash2, UserPlus } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { clearNotifications, markAllNotificationsRead, markNotificationRead } from '../features/notifications/notificationsSlice'

const TopBar = () => {
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')
  const notificationRef = useRef(null)
  const notifications = useSelector((state) => state.notifications.items)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const unreadCount = useMemo(() => notifications.filter((item) => !item.read).length, [notifications])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (!open || notificationRef.current?.contains(event.target)) return
      setOpen(false)
    }

    document.addEventListener('pointerdown', closeOnOutsideClick)
    return () => document.removeEventListener('pointerdown', closeOnOutsideClick)
  }, [open])

  const openNotification = (notification) => {
    dispatch(markNotificationRead(notification.id))
    setOpen(false)
    if (notification.actionTo) navigate(notification.actionTo)
  }

  const notificationIcon = (type) => {
    if (type === 'message') return <MessageCircle className='size-4' />
    if (type === 'call') return <PhoneCall className='size-4' />
    if (type === 'connection') return <UserPlus className='size-4' />
    return <Bell className='size-4' />
  }

  return (
    <header className='sticky top-0 z-10 flex h-16 items-center justify-end gap-3 border-b border-slate-200 bg-white/85 px-4 backdrop-blur dark-shell'>
      <button
        onClick={() => setTheme((value) => value === 'dark' ? 'light' : 'dark')}
        className='flex size-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
        title={theme === 'dark' ? 'Use light mode' : 'Use dark mode'}
      >
        {theme === 'dark' ? <Sun className='size-5' /> : <Moon className='size-5' />}
      </button>

      <div ref={notificationRef} className='relative'>
        <button
          onClick={() => setOpen((value) => !value)}
          className='relative flex size-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
          title='Notifications'
        >
          <Bell className='size-5' />
          {unreadCount > 0 && (
            <span className='absolute -right-1 -top-1 flex min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-semibold text-white'>
              {unreadCount}
            </span>
          )}
        </button>

        {open && (
          <div className='absolute right-0 mt-3 w-88 max-w-[calc(100vw-2rem)] overflow-hidden rounded-md border border-slate-200 bg-white shadow-xl'>
            <div className='flex items-center justify-between border-b border-slate-200 px-4 py-3'>
              <div>
                <p className='font-semibold text-slate-950'>Notifications</p>
                <p className='text-xs text-slate-500'>{unreadCount} unread</p>
              </div>
              <div className='flex gap-1'>
                <button onClick={() => dispatch(markAllNotificationsRead())} className='rounded p-2 text-slate-500 hover:bg-slate-100' title='Mark all read'>
                  <CheckCheck className='size-4' />
                </button>
                <button onClick={() => dispatch(clearNotifications())} className='rounded p-2 text-slate-500 hover:bg-slate-100' title='Clear'>
                  <Trash2 className='size-4' />
                </button>
              </div>
            </div>

            <div className='max-h-96 overflow-y-auto'>
              {notifications.length > 0 ? notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => openNotification(notification)}
                  className='flex w-full gap-3 border-b border-slate-100 px-4 py-3 text-left hover:bg-slate-50'
                >
                  <span className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full ${notification.read ? 'bg-slate-100 text-slate-400' : 'bg-indigo-50 text-indigo-600'}`}>
                    {notificationIcon(notification.type)}
                  </span>
                  <span className='min-w-0 flex-1'>
                    <span className='block truncate text-sm font-semibold text-slate-900'>{notification.title}</span>
                    <span className='mt-1 block text-sm leading-5 text-slate-500'>{notification.body}</span>
                  </span>
                </button>
              )) : (
                <div className='px-4 py-10 text-center'>
                  <p className='font-medium text-slate-800'>Nothing yet</p>
                  <p className='mt-1 text-sm text-slate-500'>Messages and requests will appear here.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default TopBar
