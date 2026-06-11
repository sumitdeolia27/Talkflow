import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import { useSelector } from 'react-redux'
import { assets } from '../assets/assets'
import { useAuth, useUser } from '../context/AuthContext.jsx'
import api from '../api/axios'

const FloatingMessages = () => {
  const [messages, setMessages] = useState([])
  const { user } = useUser()
  const { getToken } = useAuth()
  const unreadCount = useSelector((state) => state.notifications.items.filter((item) => item.type === 'message' && !item.read).length)

  const previewUsers = useMemo(() => {
    const seen = new Set()
    return messages
      .map((message) => message.from_user_id)
      .filter((sender) => {
        if (!sender?._id || seen.has(sender._id)) return false
        seen.add(sender._id)
        return true
      })
      .slice(0, 3)
  }, [messages])

  const fetchRecentMessages = async () => {
    try {
      const token = await getToken()
      const { data } = await api.get('/api/user/recent-messages', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (data.success) setMessages(data.messages)
    } catch {
      setMessages([])
    }
  }

  useEffect(() => {
    if (!user) return undefined

    fetchRecentMessages()
    const interval = setInterval(fetchRecentMessages, 30000)
    return () => clearInterval(interval)
  }, [user])

  return (
    <Link
      to='/messages'
      className='fixed bottom-6 right-6 z-30 hidden items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3 text-slate-950 shadow-xl transition hover:-translate-y-0.5 hover:shadow-2xl md:flex'
    >
      <span className='relative flex size-9 items-center justify-center'>
        <MessageCircle className='size-7' />
        {unreadCount > 0 && (
          <span className='absolute -right-1 -top-1 flex min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white'>
            {unreadCount}
          </span>
        )}
      </span>
      <span className='text-lg font-semibold'>Messages</span>
      <span className='flex -space-x-2'>
        {previewUsers.map((sender) => (
          <img
            key={sender._id}
            src={sender.profile_picture || assets.sample_profile}
            alt=''
            className='size-8 rounded-full border-2 border-white object-cover'
          />
        ))}
        {previewUsers.length === 0 && (
          <span className='flex size-8 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-xs text-slate-500'>
            ...
          </span>
        )}
      </span>
    </Link>
  )
}

export default FloatingMessages
