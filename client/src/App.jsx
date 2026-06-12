import React, { useRef } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import Home from './pages/Home'
import Login from './pages/Login'
import Feed from './pages/Feed'
import Messages from './pages/Messages'
import ChatBox from './pages/ChatBox'
import Connections from './pages/Connections'
import Discover from './pages/Discover'
import Profile from './pages/Profile'
import CreatePost from './pages/CreatePost'
import { useAuth } from './context/AuthContext.jsx'
import Layout from './pages/Layout'
import toast, { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchUser } from './features/user/userSlice'
import { fetchConnections } from './features/connections/connectionsSlice'
import { addMessage } from './features/messages/messagesSlice'
import { addNotification } from './features/notifications/notificationsSlice'
import Notification from './components/Notification'
import Loading from './components/Loading'

const App = () => {
  const { user, loading, getToken } = useAuth()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const pathnameRef = useRef(pathname)
  const pendingRequestIdsRef = useRef(null)

  const dispatch = useDispatch()

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const token = await getToken()
        if (token) {
          dispatch(fetchUser(token))
          dispatch(fetchConnections(token))
        }
      }
    }
    fetchData()
  }, [user, getToken, dispatch])

  useEffect(() => {
    pathnameRef.current = pathname
  }, [pathname])

  useEffect(() => {
    if (user) {
      const eventSource = new EventSource(import.meta.env.VITE_BASEURL + '/api/message/' + user.uid);

      eventSource.onmessage = (event) => {
        let data
        try {
          data = JSON.parse(event.data)
        } catch {
          return
        }

        if (data.event === 'call-signal') {
          window.dispatchEvent(new CustomEvent('call-signal', { detail: data.signal }))

          if (data.signal.type === 'offer') {
            dispatch(addNotification({
              id: `call-${data.signal.from_user_id._id}-${Date.now()}`,
              type: 'call',
              fromUserId: data.signal.from_user_id._id,
              title: `Incoming ${data.signal.payload?.callType === 'video' ? 'video' : 'audio'} call`,
              body: `${data.signal.from_user_id.full_name} is calling you.`,
              actionTo: `/messages/${data.signal.from_user_id._id}`,
            }))
          }

          if (data.signal.type === 'offer' && pathnameRef.current !== ('/messages/' + data.signal.from_user_id._id)) {
            toast.custom((t) => (
              <div className='flex w-full max-w-md overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg'>
                <div className='flex flex-1 items-start gap-3 p-4'>
                  <img src={data.signal.from_user_id.profile_picture} alt='' className='size-10 rounded-full object-cover' />
                  <div>
                    <p className='text-sm font-semibold text-slate-900'>Incoming {data.signal.payload?.callType === 'video' ? 'video' : 'audio'} call</p>
                    <p className='text-sm text-slate-500'>{data.signal.from_user_id.full_name} is calling you.</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    navigate(`/messages/${data.signal.from_user_id._id}`)
                    toast.dismiss(t.id)
                  }}
                  className='border-l border-slate-200 px-4 text-sm font-semibold text-indigo-600'
                >
                  Open
                </button>
              </div>
            ), { id: `incoming-call-${data.signal.from_user_id._id}`, position: 'bottom-right', duration: 10000 })
          }
          return
        }

        const message = data.event === 'message' ? data.message : data
        if (!message?.from_user_id?._id) return

        if (pathnameRef.current === ('/messages/' + message.from_user_id._id)) {
          dispatch(addMessage(message))
        } else {
          dispatch(addNotification({
            id: `message-${message._id}`,
            type: 'message',
            fromUserId: message.from_user_id._id,
            title: `Message from ${message.from_user_id.full_name}`,
            body: message.message_type === 'image' ? 'Sent you an image' : message.text || 'New message',
            actionTo: `/messages/${message.from_user_id._id}`,
          }))
          toast.custom((t) => (
            <Notification t={t} message={message} />
          ), { position: "bottom-right" })
        }
      }
      return () => {
        eventSource.close()
      }
    }
  }, [user, dispatch, navigate])

  useEffect(() => {
    if (!user) {
      pendingRequestIdsRef.current = null
      return
    }

    const checkConnectionRequests = async () => {
      const token = await getToken()
      if (!token) return

      const result = await dispatch(fetchConnections(token)).unwrap()
      if (!result) return

      const pendingConnections = Array.isArray(result.pendingConnections) ? result.pendingConnections : []
      const currentIds = pendingConnections.map((requestUser) => requestUser._id)

      const newRequests = pendingRequestIdsRef.current === null
        ? pendingConnections
        : pendingConnections.filter(
            (requestUser) => !pendingRequestIdsRef.current.includes(requestUser._id)
          )

      newRequests.forEach((requestUser) => {
        dispatch(addNotification({
          id: `connection-request-${requestUser._id}`,
          type: 'connection',
          title: 'New connection request',
          body: `${requestUser.full_name} wants to connect with you.`,
          actionTo: '/connections',
        }))
        toast.custom((t) => (
          <div className='flex w-full max-w-md overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg'>
            <div className='flex flex-1 items-start gap-3 p-4'>
              <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600'>
                <UserPlus className='size-5' />
              </div>
              <div>
                <p className='text-sm font-semibold text-slate-900'>New connection request</p>
                <p className='text-sm text-slate-500'>{requestUser.full_name} wants to connect with you.</p>
              </div>
            </div>
            <button
              onClick={() => {
                navigate('/connections')
                toast.dismiss(t.id)
              }}
              className='border-l border-slate-200 px-4 text-sm font-semibold text-indigo-600'
            >
              Open
            </button>
          </div>
        ), { id: `connection-request-${requestUser._id}`, position: 'bottom-right', duration: 8000 })
      })

      pendingRequestIdsRef.current = currentIds
    }

    checkConnectionRequests()
    const intervalId = setInterval(checkConnectionRequests, 15000)

    return () => clearInterval(intervalId)
  }, [dispatch, getToken, navigate, user])

  if (loading) {
    return <Loading />
  }

  return (
    <>
      <Toaster />
      {!user ? (
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='*' element={<Navigate to='/login' replace />} />
        </Routes>
      ) : (
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Feed />} />
            <Route path='messages' element={<Messages />} />
            <Route path='messages/:userId' element={<ChatBox />} />
            <Route path='connections' element={<Connections />} />
            <Route path='discover' element={<Discover />} />
            <Route path='profile' element={<Profile />} />
            <Route path='profile/:profileId' element={<Profile />} />
            <Route path='create-post' element={<CreatePost />} />
          </Route>
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      )}
    </>
  )
}

export default App
