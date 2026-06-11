import React, { useEffect, useState } from 'react'
import { MessageSquare, Search, UserCheck, UserPlus, UserRoundPen, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useAuth } from '../context/AuthContext.jsx'
import { fetchConnections } from '../features/connections/connectionsSlice'
import api from '../api/axios'
import toast from 'react-hot-toast'

const Connections = () => {
  const [currentTab, setCurrentTab] = useState('Followers')

  const navigate = useNavigate()
  const { getToken } = useAuth()
  const dispatch = useDispatch()

  const { connections, pendingConnections, followers, following } = useSelector((state) => state.connections)

  const dataArray = [
    { label: 'Followers', value: followers, icon: Users },
    { label: 'Following', value: following, icon: UserCheck },
    { label: 'Pending', value: pendingConnections, icon: UserRoundPen },
    { label: 'Connections', value: connections, icon: UserPlus },
  ]

  const currentData = dataArray.find((item) => item.label === currentTab)

  const handleUnfollow = async (userId) => {
    try {
      const { data } = await api.post('/api/user/unfollow', { id: userId }, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      if (data.success) {
        toast.success(data.message)
        dispatch(fetchConnections(await getToken()))
      } else {
        toast(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const acceptConnection = async (userId) => {
    try {
      const { data } = await api.post('/api/user/accept', { id: userId }, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      if (data.success) {
        toast.success(data.message)
        dispatch(fetchConnections(await getToken()))
      } else {
        toast(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    getToken().then((token) => {
      dispatch(fetchConnections(token))
    })
  }, [])

  return (
    <div className='min-h-screen bg-slate-50'>
      <div className='mx-auto max-w-6xl px-5 py-8 sm:px-8'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-slate-950'>Connections</h1>
            <p className='mt-2 text-sm text-slate-500'>Manage requests, followers, and people you can message.</p>
          </div>
          <button
            onClick={() => navigate('/discover')}
            className='inline-flex w-fit items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700'
          >
            <Search className='size-4' />
            Discover
          </button>
        </div>

        <section className='mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
          {dataArray.map((item) => (
            <button
              key={item.label}
              onClick={() => setCurrentTab(item.label)}
              className={`rounded-md border bg-white p-4 text-left shadow-sm transition hover:border-indigo-200 ${currentTab === item.label ? 'border-indigo-300 bg-indigo-50/40' : 'border-slate-200'}`}
            >
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <span className='flex size-9 items-center justify-center rounded-md bg-slate-100 text-slate-600'>
                    <item.icon className='size-4' />
                  </span>
                  <p className='font-medium text-slate-700'>{item.label}</p>
                </div>
                <p className='text-2xl font-bold text-slate-950'>{item.value.length}</p>
              </div>
            </button>
          ))}
        </section>

        <section className='mt-6 rounded-md border border-slate-200 bg-white shadow-sm'>
          <div className='flex flex-wrap gap-1 border-b border-slate-200 p-2'>
            {dataArray.map((tab) => (
              <button
                onClick={() => setCurrentTab(tab.label)}
                key={tab.label}
                className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${currentTab === tab.label ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
              >
                <tab.icon className='size-4' />
                {tab.label}
                <span className={`rounded-full px-2 py-0.5 text-xs ${currentTab === tab.label ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {tab.value.length}
                </span>
              </button>
            ))}
          </div>

          {currentData.value.length > 0 ? (
            <div className='grid gap-4 p-4 md:grid-cols-2'>
              {currentData.value.map((user) => (
                <article key={user._id} className='flex gap-4 rounded-md border border-slate-200 bg-white p-4 transition hover:border-indigo-200 hover:shadow-sm'>
                  <img src={user.profile_picture} alt='' className='size-14 rounded-full object-cover ring-1 ring-slate-200' />
                  <div className='min-w-0 flex-1'>
                    <div className='flex items-start justify-between gap-3'>
                      <div className='min-w-0'>
                        <p className='truncate font-semibold text-slate-950'>{user.full_name}</p>
                        <p className='truncate text-sm text-slate-500'>@{user.username}</p>
                      </div>
                    </div>
                    <p className='mt-2 line-clamp-2 text-sm leading-6 text-slate-600'>
                      {user.bio || 'No bio added yet.'}
                    </p>
                    <div className='mt-4 flex flex-wrap gap-2'>
                      <button
                        onClick={() => navigate(`/profile/${user._id}`)}
                        className='rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800'
                      >
                        View Profile
                      </button>

                      {currentTab === 'Following' && (
                        <button onClick={() => handleUnfollow(user._id)} className='rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100'>
                          Unfollow
                        </button>
                      )}

                      {currentTab === 'Pending' && (
                        <button onClick={() => acceptConnection(user._id)} className='rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700'>
                          Accept
                        </button>
                      )}

                      {currentTab === 'Connections' && (
                        <button onClick={() => navigate(`/messages/${user._id}`)} className='inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100'>
                          <MessageSquare className='size-4' />
                          Message
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className='p-10 text-center'>
              <currentData.icon className='mx-auto size-10 text-slate-300' />
              <p className='mt-3 font-semibold text-slate-900'>No {currentTab.toLowerCase()} yet</p>
              <p className='mt-1 text-sm text-slate-500'>
                {currentTab === 'Pending' ? 'New connection requests will appear here.' : 'Use Discover to find people.'}
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default Connections
