import React, { useEffect } from 'react'
import { Eye, MessageSquare, UserPlus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useAuth } from '../context/AuthContext.jsx'
import { fetchConnections } from '../features/connections/connectionsSlice'

const Messages = () => {

  const { connections } = useSelector((state)=>state.connections)
  const { getToken } = useAuth()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    getToken().then((token) => {
      if (token) dispatch(fetchConnections(token))
    })
  }, [dispatch, getToken])

  return (
    <div className='min-h-screen relative bg-slate-50'>
      <div className='max-w-6xl mx-auto p-6'>
        {/* Title */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-slate-900 mb-2'>Messages</h1>
          <p className='text-slate-600'>Talk to your friends and family</p>
        </div>

        {/* Connected Users */}
        <div className='flex flex-col gap-3'>
          {connections.length > 0 ? connections.map((user)=>(
            <div key={user._id} className='max-w-xl flex flex-wrap gap-5 p-6 bg-white shadow rounded-md'>
              <img src={user.profile_picture} alt="" className='rounded-full size-12 mx-auto'/>
              <div className='flex-1'>
                <p className='font-medium text-slate-700'>{user.full_name}</p>
                <p className='text-slate-500'>@{user.username}</p>
                <p className='text-sm text-gray-600'>{user.bio}</p>
              </div>

              <div className='flex flex-col gap-2 mt-4'>

                <button onClick={()=> navigate(`/messages/${user._id}`)} className='size-10 flex items-center justify-center text-sm rounded bg-slate-100 hover:bg-slate-200 text-slate-800 active:scale-95 transition cursor-pointer gap-1'>
                  <MessageSquare className="w-4 h-4"/>
                </button>

                <button onClick={()=> navigate(`/profile/${user._id}`)} className='size-10 flex items-center justify-center text-sm rounded bg-slate-100 hover:bg-slate-200 text-slate-800 active:scale-95 transition cursor-pointer'>
                  <Eye className="w-4 h-4"/>
                </button>

              </div>

            </div>
          )) : (
            <div className='max-w-xl rounded-md border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm'>
              <UserPlus className='mx-auto mb-3 size-10 text-indigo-500' />
              <p className='font-medium text-slate-800'>No connections yet</p>
              <p className='mt-1 text-sm text-slate-500'>Accept a connection request or connect with someone before sending messages.</p>
              <button
                onClick={() => navigate('/connections')}
                className='mt-4 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700'
              >
                Go to Connections
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Messages
