import React, { useEffect, useRef, useState } from 'react'
import { ImageIcon, Mic, MicOff, Phone, PhoneOff, SendHorizonal, Video, VideoOff, X } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../api/axios'
import { addMessage, fetchMessages, resetMessages } from '../features/messages/messagesSlice'
import { fetchConnections } from '../features/connections/connectionsSlice'
import { markMessageNotificationsRead } from '../features/notifications/notificationsSlice'
import toast from 'react-hot-toast'

const ChatBox = () => {

  const {messages} = useSelector((state)=>state.messages)
  const { userId } = useParams()
  const { getToken } = useAuth()
  const dispatch = useDispatch()

  const [text, setText] = useState('')
  const [image, setImage] = useState(null)
  const [user, setUser] = useState(null)
  const [activeCall, setActiveCall] = useState(null)
  const [localStream, setLocalStream] = useState(null)
  const [remoteStream, setRemoteStream] = useState(null)
  const [incomingCall, setIncomingCall] = useState(null)
  const [callStatus, setCallStatus] = useState('')
  const [micEnabled, setMicEnabled] = useState(true)
  const [cameraEnabled, setCameraEnabled] = useState(true)
  const messagesEndRef = useRef(null)
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const peerConnectionRef = useRef(null)
  const localStreamRef = useRef(null)
  const pendingOfferRef = useRef(null)

  const connections = useSelector((state) => state.connections.connections)

  const sendMessage = async () => {
    try {
      if(!text && !image) return

      const token = await getToken()
      const formData = new FormData();
      formData.append('to_user_id', userId)
      formData.append('text', text);
      image && formData.append('image', image);

      const { data } = await api.post('/api/message/send', formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (data.success) {
        setText('')
        setImage(null)
        dispatch(addMessage(data.message))
      }else{
        throw new Error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const stopLocalStream = (stream) => {
    stream?.getTracks().forEach((track) => track.stop())
  }

  const sendCallSignal = async (type, payload = {}) => {
    const token = await getToken()
    if (!token) return

    await api.post('/api/message/call-signal', {
      to_user_id: userId,
      type,
      payload,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
  }

  const createPeerConnection = () => {
    peerConnectionRef.current?.close()

    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    })

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        sendCallSignal('candidate', { candidate: event.candidate }).catch((error) => toast.error(error.message))
      }
    }

    peerConnection.ontrack = (event) => {
      const [stream] = event.streams
      setRemoteStream(stream)
    }

    peerConnection.onconnectionstatechange = () => {
      setCallStatus(peerConnection.connectionState)
      if (['closed', 'failed', 'disconnected'].includes(peerConnection.connectionState)) {
        if (peerConnection.connectionState !== 'disconnected') endCall(false)
      }
    }

    peerConnectionRef.current = peerConnection
    return peerConnection
  }

  const getLocalStream = async (type) => {
    stopLocalStream(localStreamRef.current)
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: type === 'video'
      })

      setLocalStream(stream)
      localStreamRef.current = stream
      return stream
  }

  const startCall = async (type) => {
    try {
      const stream = await getLocalStream(type)
      const peerConnection = createPeerConnection()
      stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream))

      const offer = await peerConnection.createOffer()
      await peerConnection.setLocalDescription(offer)
      await sendCallSignal('offer', { description: offer, callType: type })

      setActiveCall(type)
      setMicEnabled(true)
      setCameraEnabled(type === 'video')
      setCallStatus('calling')
      toast.success(`${type === 'video' ? 'Video' : 'Audio'} call ringing`)
    } catch (error) {
      toast.error(error.message || 'Could not start call')
    }
  }

  const acceptCall = async () => {
    try {
      if (!pendingOfferRef.current) return

      const { description, callType } = pendingOfferRef.current
      const stream = await getLocalStream(callType)
      const peerConnection = createPeerConnection()
      stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream))

      await peerConnection.setRemoteDescription(new RTCSessionDescription(description))
      const answer = await peerConnection.createAnswer()
      await peerConnection.setLocalDescription(answer)
      await sendCallSignal('answer', { description: answer })

      setIncomingCall(null)
      setActiveCall(callType)
      setMicEnabled(true)
      setCameraEnabled(callType === 'video')
      setCallStatus('connecting')
      pendingOfferRef.current = null
    } catch (error) {
      toast.error(error.message || 'Could not accept call')
    }
  }

  const endCall = (notifyPeer = true) => {
    if (notifyPeer && (activeCall || incomingCall)) {
      sendCallSignal('end').catch(() => {})
    }

    peerConnectionRef.current?.close()
    peerConnectionRef.current = null
    stopLocalStream(localStreamRef.current)
    localStreamRef.current = null
    setLocalStream(null)
    setRemoteStream(null)
    setActiveCall(null)
    setIncomingCall(null)
    setCallStatus('')
    setMicEnabled(true)
    setCameraEnabled(true)
    pendingOfferRef.current = null
  }

  const toggleMic = () => {
    localStream?.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled
      setMicEnabled(track.enabled)
    })
  }

  const toggleCamera = () => {
    localStream?.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled
      setCameraEnabled(track.enabled)
    })
  }

  useEffect(()=>{
    const loadChat = async () => {
      const token = await getToken()
      if (token) {
        dispatch(fetchConnections(token))
        dispatch(fetchMessages({token, userId}))
        dispatch(markMessageNotificationsRead(userId))
      }
    }

    loadChat()

    return ()=>{
      dispatch(resetMessages())
    }
  },[dispatch, getToken, userId])

  useEffect(()=>{
    if(connections.length > 0){
      const user = connections.find(connection => connection._id === userId)
      setUser(user)
    }
  },[connections, userId])

  useEffect(()=>{
    messagesEndRef.current?.scrollIntoView({behavior: "smooth" })
  },[messages])

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream
    }
  }, [localStream])

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream
    }
  }, [remoteStream])

  useEffect(() => {
    const handleCallSignal = async (event) => {
      const signal = event.detail
      if (signal.from_user_id._id !== userId) return

      try {
        if (signal.type === 'offer') {
          pendingOfferRef.current = signal.payload
          setIncomingCall({
            from: signal.from_user_id,
            callType: signal.payload.callType,
          })
          return
        }

        if (signal.type === 'answer' && peerConnectionRef.current) {
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(signal.payload.description))
          setCallStatus('connected')
          return
        }

        if (signal.type === 'candidate' && peerConnectionRef.current) {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(signal.payload.candidate))
          return
        }

        if (signal.type === 'end') {
          toast('Call ended')
          endCall(false)
        }
      } catch (error) {
        toast.error(error.message || 'Call connection failed')
      }
    }

    window.addEventListener('call-signal', handleCallSignal)
    return () => window.removeEventListener('call-signal', handleCallSignal)
  }, [userId])

  useEffect(() => {
    return () => endCall(false)
  }, [])

  return user ? (
    <div className='chat-page flex h-full min-h-0 flex-col overflow-hidden'>
      <div className='chat-header flex items-center gap-2 p-2 md:px-10 xl:pl-42 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-300'>
        <img src={user.profile_picture} alt="" className="size-8 rounded-full"/>
        <div className='flex-1'>
          <p className="chat-user-name font-medium">{user.full_name}</p>
          <p className="chat-user-handle text-sm text-gray-500 -mt-1.5">@{user.username}</p>
        </div>
        <div className='flex items-center gap-2'>
          <button
            onClick={() => startCall('audio')}
            title='Start audio call'
            className='chat-call-button flex size-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-100'
          >
            <Phone className='size-5' />
          </button>
          <button
            onClick={() => startCall('video')}
            title='Start video call'
            className='flex size-10 items-center justify-center rounded-full bg-indigo-600 text-white shadow-sm hover:bg-indigo-700'
          >
            <Video className='size-5' />
          </button>
        </div>
      </div>
      <div className='chat-messages min-h-0 flex-1 overflow-y-auto p-5 md:px-10'>
        <div className='space-y-4 max-w-4xl mx-auto'>
          {
            messages.toSorted((a,b)=> new Date(a.createdAt) - new Date(b.createdAt)).map((message, index)=>(
              <div key={index} className={`flex flex-col ${message.to_user_id !== user._id ? 'items-start' : 'items-end'}`}>
                <div className={`chat-bubble p-2 text-sm max-w-sm bg-white text-slate-700 rounded-lg shadow ${message.to_user_id !== user._id ? 'chat-bubble-in rounded-bl-none' : 'chat-bubble-out rounded-br-none'}`}>
                  {
                  message.message_type === 'image' && <img src={message.media_url} className='w-full max-w-sm rounded-lg mb-1' alt="" />
                  }
                  <p>{message.text}</p>
                </div>

              </div>
            ))
          }
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className='chat-composer-wrap px-4'>
          <div className='chat-composer flex items-center gap-3 pl-5 p-1.5 bg-white w-full max-w-xl mx-auto border border-gray-200 shadow rounded-full mb-5'>
            <input type="text" className='chat-input flex-1 outline-none text-slate-700' placeholder='Type a message...'
            onKeyDown={e=>e.key === 'Enter' && sendMessage()} onChange={(e)=>setText(e.target.value)} value={text} />

            <label htmlFor="image">
              {
                image 
                ? <img src={URL.createObjectURL(image)} alt="" className='h-8 rounded'/> 
                : <ImageIcon className='size-7 text-gray-400 cursor-pointer'/>
              }
              <input type="file" id='image' accept="image/*" hidden onChange={(e)=>setImage(e.target.files[0])}/>
            </label>

            <button onClick={sendMessage} className='bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95 cursor-pointer text-white p-2 rounded-full'>
              <SendHorizonal size={18}/>
            </button>
          </div>
      </div>

      {activeCall && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm'>
          <div className='w-full max-w-3xl overflow-hidden rounded-md bg-slate-900 text-white shadow-2xl'>
            <div className='flex items-center justify-between border-b border-white/10 px-5 py-4'>
              <div className='flex items-center gap-3'>
                <img src={user.profile_picture} alt='' className='size-10 rounded-full object-cover' />
                <div>
                  <p className='font-semibold'>{activeCall === 'video' ? 'Video call' : 'Audio call'} with {user.full_name}</p>
                  <p className='text-sm text-slate-300'>{callStatus || 'connecting'}</p>
                </div>
              </div>
              <button onClick={endCall} className='rounded-full p-2 text-slate-300 hover:bg-white/10 hover:text-white'>
                <X className='size-5' />
              </button>
            </div>

            <div className='grid min-h-96 place-items-center bg-slate-950 p-5'>
              {activeCall === 'video' ? (
                <div className='relative w-full'>
                  <video ref={remoteVideoRef} autoPlay playsInline className='max-h-[60vh] min-h-80 w-full rounded-md bg-black object-cover' />
                  <video ref={localVideoRef} autoPlay muted playsInline className='absolute bottom-4 right-4 h-32 w-44 rounded-md border border-white/20 bg-black object-cover shadow-xl' />
                  {!remoteStream && (
                    <div className='absolute inset-0 flex items-center justify-center rounded-md bg-slate-950/70 text-slate-200'>
                      Waiting for {user.full_name} to answer...
                    </div>
                  )}
                </div>
              ) : (
                <div className='flex flex-col items-center gap-4 text-center'>
                  <img src={user.profile_picture} alt='' className='size-28 rounded-full object-cover ring-4 ring-indigo-500/40' />
                  <div>
                    <p className='text-2xl font-semibold'>{user.full_name}</p>
                    <p className='mt-1 text-slate-300'>{remoteStream ? 'Audio call connected' : `Waiting for ${user.full_name} to answer...`}</p>
                  </div>
                </div>
              )}
            </div>

            <div className='flex items-center justify-center gap-3 bg-slate-900 px-5 py-5'>
              <button
                onClick={toggleMic}
                className={`flex size-12 items-center justify-center rounded-full ${micEnabled ? 'bg-white text-slate-900' : 'bg-red-500 text-white'}`}
                title={micEnabled ? 'Mute microphone' : 'Unmute microphone'}
              >
                {micEnabled ? <Mic className='size-5' /> : <MicOff className='size-5' />}
              </button>
              {activeCall === 'video' && (
                <button
                  onClick={toggleCamera}
                  className={`flex size-12 items-center justify-center rounded-full ${cameraEnabled ? 'bg-white text-slate-900' : 'bg-red-500 text-white'}`}
                  title={cameraEnabled ? 'Turn camera off' : 'Turn camera on'}
                >
                  {cameraEnabled ? <Video className='size-5' /> : <VideoOff className='size-5' />}
                </button>
              )}
              <button onClick={endCall} className='flex size-12 items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700' title='End call'>
                <PhoneOff className='size-5' />
              </button>
            </div>
          </div>
        </div>
      )}

      {incomingCall && !activeCall && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm'>
          <div className='w-full max-w-sm rounded-md bg-white p-6 text-center shadow-2xl'>
            <img src={incomingCall.from.profile_picture} alt='' className='mx-auto size-20 rounded-full object-cover' />
            <p className='mt-4 text-lg font-semibold text-slate-900'>{incomingCall.from.full_name}</p>
            <p className='mt-1 text-sm text-slate-500'>Incoming {incomingCall.callType === 'video' ? 'video' : 'audio'} call</p>
            <div className='mt-6 flex justify-center gap-4'>
              <button onClick={() => endCall(true)} className='flex size-12 items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700'>
                <PhoneOff className='size-5' />
              </button>
              <button onClick={acceptCall} className='flex size-12 items-center justify-center rounded-full bg-emerald-600 text-white hover:bg-emerald-700'>
                {incomingCall.callType === 'video' ? <Video className='size-5' /> : <Phone className='size-5' />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  ) : (
    <div className='flex h-screen items-center justify-center bg-slate-50 px-6 text-center'>
      <div>
        <p className='font-medium text-slate-800'>Chat not available</p>
        <p className='mt-1 text-sm text-slate-500'>This user is not in your accepted connections yet.</p>
      </div>
    </div>
  )
}

export default ChatBox
