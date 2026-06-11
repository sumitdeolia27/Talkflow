import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { assets } from '../assets/assets'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { fetchUser } from '../features/user/userSlice'

const SuggestionsPanel = () => {
  const currentUser = useSelector((state) => state.user.value)
  const [suggestions, setSuggestions] = useState([])
  const [following, setFollowing] = useState([])
  const { getToken } = useAuth()
  const dispatch = useDispatch()

  const visibleSuggestions = useMemo(() => (
    suggestions
      .filter((user) => user._id !== currentUser?._id)
      .filter((user) => !currentUser?.following?.includes(user._id))
      .slice(0, 5)
  ), [currentUser, suggestions])

  const fetchSuggestions = async () => {
    try {
      const token = await getToken()
      const { data } = await api.post('/api/user/discover', { input: '' }, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (data.success) {
        setSuggestions(data.users)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleFollow = async (userId) => {
    try {
      setFollowing((value) => [...value, userId])
      const token = await getToken()
      const { data } = await api.post('/api/user/follow', { id: userId }, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (data.success) {
        dispatch(fetchUser(token))
        setSuggestions((value) => value.filter((user) => user._id !== userId))
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setFollowing((value) => value.filter((id) => id !== userId))
    }
  }

  useEffect(() => {
    fetchSuggestions()
  }, [])

  return (
    <aside className='w-80 pt-4 text-sm'>
      <div className='mb-6 flex items-center justify-between gap-3'>
        <Link to='/profile' className='flex min-w-0 items-center gap-3'>
          <img
            src={currentUser?.profile_picture || assets.sample_profile}
            alt=''
            className='size-12 rounded-full object-cover'
          />
          <div className='min-w-0'>
            <p className='truncate font-semibold text-slate-950'>{currentUser?.username}</p>
            <p className='truncate text-slate-500'>{currentUser?.full_name}</p>
          </div>
        </Link>
        <Link to='/profile' className='text-xs font-semibold text-indigo-600 hover:text-indigo-500'>Profile</Link>
      </div>

      <div className='mb-4 flex items-center justify-between'>
        <h2 className='font-semibold text-slate-500'>Suggested for you</h2>
        <Link to='/discover' className='text-xs font-semibold text-slate-900 hover:text-slate-600'>See all</Link>
      </div>

      <div className='space-y-4'>
        {visibleSuggestions.length > 0 ? visibleSuggestions.map((user) => (
          <div key={user._id} className='flex items-center justify-between gap-3'>
            <Link to={`/profile/${user._id}`} className='flex min-w-0 items-center gap-3'>
              <img
                src={user.profile_picture || assets.sample_profile}
                alt=''
                className='size-11 rounded-full object-cover'
              />
              <div className='min-w-0'>
                <p className='truncate font-semibold text-slate-950'>{user.full_name}</p>
                <p className='truncate text-xs text-slate-500'>@{user.username}</p>
              </div>
            </Link>
            <button
              onClick={() => handleFollow(user._id)}
              disabled={following.includes(user._id)}
              className='text-xs font-semibold text-indigo-600 hover:text-indigo-500 disabled:text-slate-400'
            >
              {following.includes(user._id) ? '...' : 'Follow'}
            </button>
          </div>
        )) : (
          <div className='rounded-md border border-slate-200 bg-white p-4 text-slate-500'>
            No suggestions yet.
          </div>
        )}
      </div>

      <p className='mt-10 text-xs leading-5 text-slate-400'>
        About · Help · Privacy · Terms · TalkFlow
      </p>
    </aside>
  )
}

export default SuggestionsPanel
