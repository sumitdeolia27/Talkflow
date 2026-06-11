import React, { useEffect, useState } from 'react'
import Loading from '../components/Loading'
import StoriesBar from '../components/StoriesBar'
import PostCard from '../components/PostCard'
import SuggestionsPanel from '../components/SuggestionsPanel'
import FloatingMessages from '../components/FloatingMessages'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../api/axios'
import toast from 'react-hot-toast'

const Feed = () => {

  const [feeds, setFeeds] = useState([])
  const [loading, setLoading] = useState(true)
  const {getToken} = useAuth()


  const fetchFeeds = async () => {
    try {
      setLoading(true)
      const {data} = await api.get('/api/post/feed', {headers: { Authorization: `Bearer ${await getToken()}` }})

      if (data.success){
        setFeeds(data.posts)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  const handlePostDelete = (postId) => {
    setFeeds((posts) => posts.filter((post) => post._id !== postId))
  }

  useEffect(()=>{
    fetchFeeds()
  },[])

  return !loading ? (
    <div className='feed-page h-full overflow-y-scroll no-scrollbar bg-white py-8 xl:pr-5'>
      {/* Stories and post list */}
      <div className='mx-auto flex max-w-6xl items-start justify-center gap-12 px-4'>
        <div className='w-full max-w-2xl'>
          <StoriesBar />
          <div className='space-y-8 px-4 py-5'>
            {feeds.map((post)=>(
              <PostCard key={post._id} post={post} onDelete={handlePostDelete}/>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className='max-xl:hidden sticky top-0'>
          <SuggestionsPanel />
        </div>
      </div>
      <FloatingMessages />
    </div>
  ) : <Loading />
}

export default Feed
