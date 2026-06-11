import React, { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import moment from 'moment'
import StoryModal from './StoryModal'
import StoryViewer from './StoryViewer'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../api/axios'
import toast from 'react-hot-toast'

const StoriesBar = () => {

    const {getToken} = useAuth()

    const [stories, setStories] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [viewStory, setViewStory] = useState(null)

    const fetchStories = async () => {
        try {
            const token = await getToken()
            const { data } = await api.get('/api/story/get', {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success){
                setStories(data.stories)
            }else{
                toast(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(()=>{
        fetchStories()
    },[])

  return (
    <div className='w-full lg:max-w-2xl no-scrollbar overflow-x-auto px-4'>

        <div className='flex gap-5 pb-5'>
            {/* Add Story Card */}
            <div onClick={()=>setShowModal(true)} className='story-create-card group flex min-w-20 max-w-20 cursor-pointer flex-col items-center gap-2'>
                <div className='flex size-17 items-center justify-center rounded-full border-2 border-dashed border-indigo-300 bg-gradient-to-b from-indigo-50 to-white transition group-hover:scale-105'>
                    <div className='size-9 bg-indigo-500 rounded-full flex items-center justify-center'>
                        <Plus className='w-5 h-5 text-white'/>
                    </div>
                </div>
                <p className='w-full truncate text-center text-xs font-medium text-slate-700'>Create</p>
            </div>
            {/* Story Cards */}
            {
                stories.map((story, index)=> (
                    <div onClick={()=> setViewStory(story)} key={index} className='story-bubble group flex min-w-20 max-w-20 cursor-pointer flex-col items-center gap-2 active:scale-95'>
                        <div className='story-ring relative flex size-17 items-center justify-center rounded-full p-0.5 transition group-hover:scale-105'>
                            <div className='relative size-full overflow-hidden rounded-full bg-gradient-to-b from-indigo-500 to-purple-600 p-0.5'>
                                <img src={story.user.profile_picture} alt="" className='relative z-10 size-full rounded-full object-cover ring-2 ring-white'/>
                                {
                                    story.media_type !== 'text' && (
                                        story.media_type === "image" ?
                                        <img src={story.media_url} alt="" className='absolute inset-0 h-full w-full rounded-full object-cover opacity-80'/>
                                        :
                                        <video src={story.media_url} className='absolute inset-0 h-full w-full rounded-full object-cover opacity-80'/>
                                    )
                                }
                            </div>
                        </div>
                        <p className='w-full truncate text-center text-xs text-slate-700'>{story.user.username || story.content || moment(story.createdAt).fromNow()}</p>
                        {
                            story.content && <span className='sr-only'>{story.content} {moment(story.createdAt).fromNow()}</span>
                        }
                    </div>
                ))
            }
        </div>

        {/* Add Story Modal */}
        {showModal && <StoryModal setShowModal={setShowModal} fetchStories={fetchStories}/>}
        {/* View Story Modal */}
        {viewStory && <StoryViewer viewStory={viewStory} setViewStory={setViewStory}/>}
      
    </div>
  )
}

export default StoriesBar
