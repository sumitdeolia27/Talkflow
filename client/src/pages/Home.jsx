import React from 'react'
import { ArrowRight, MessageCircle, ShieldCheck, Users, Video } from 'lucide-react'
import { Link } from 'react-router-dom'
import ThemedLogo from '../components/ThemedLogo'

const Home = () => {
  const quickFeatures = [
    { label: 'Connect', icon: Users, color: 'from-violet-500 to-indigo-500', text: 'with real people' },
    { label: 'Chat', icon: MessageCircle, color: 'from-pink-400 to-fuchsia-500', text: 'privately' },
    { label: 'Jump into', icon: Video, color: 'from-sky-400 to-blue-600', text: 'calls' },
    { label: 'Safe &', icon: ShieldCheck, color: 'from-emerald-300 to-emerald-600', text: 'private' },
  ]

  const stats = [
    { label: 'Active Users', value: '50K+', icon: Users, color: 'from-violet-500 to-indigo-600' },
    { label: 'Conversations', value: '12K+', icon: MessageCircle, color: 'from-pink-400 to-fuchsia-500' },
    { label: 'Calls Per Day', value: '8K+', icon: Video, color: 'from-sky-400 to-blue-600' },
  ]

  return (
    <main className='home-page min-h-screen bg-[#f8fafc] text-slate-950'>
      <nav className='mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8'>
        <ThemedLogo className='h-14 w-52' />
        <div className='flex items-center gap-3'>
          <Link to='/login' className='rounded-md px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white'>
            Sign in
          </Link>
          <Link to='/login?mode=signup' className='inline-flex items-center gap-2 rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800'>
            Join now <ArrowRight className='size-4' />
          </Link>
        </div>
      </nav>

      <section className='mx-auto grid max-w-7xl items-center gap-10 px-5 pb-16 pt-8 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:pt-14'>
        <div className='max-w-2xl'>
          <p className='mb-5 inline-flex rounded-full border border-indigo-100 bg-white px-3 py-1 text-sm font-semibold text-indigo-600 shadow-sm'>
            TalkFlow social workspace
          </p>
          <h1 className='text-5xl font-black leading-tight tracking-normal text-slate-950 sm:text-7xl'>
            Connect, share, and chat in one simple place.
          </h1>
          <p className='mt-6 max-w-xl text-lg leading-8 text-slate-600'>
            TalkFlow keeps your posts, friends, messages, and calls together with a clean interface that is easy to use every day.
          </p>

          <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
            <Link to='/login?mode=signup' className='inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700'>
              Create account <ArrowRight className='size-5' />
            </Link>
            <Link to='/login' className='inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-800 shadow-sm hover:border-slate-300'>
              I already have an account
            </Link>
          </div>

          <div className='mt-12 grid max-w-2xl gap-3 sm:grid-cols-2'>
            {quickFeatures.map((item) => (
              <div key={item.label} className='flex items-center gap-3 rounded-md border border-slate-200 bg-white p-4 shadow-sm'>
                <span className={`flex size-10 items-center justify-center rounded-md bg-gradient-to-br ${item.color} text-white`}>
                  <item.icon className='size-5' />
                </span>
                <span>
                  <span className='block text-sm font-bold text-slate-950'>{item.label}</span>
                  <span className='block text-xs font-medium text-slate-500'>{item.text}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className='relative'>
          <div className='rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-200'>
            <div className='overflow-hidden rounded-xl border border-slate-200 bg-slate-950 text-white'>
              <div className='flex items-center justify-between border-b border-white/10 px-5 py-4'>
                <div className='flex items-center gap-3'>
                  <div className='flex size-10 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 to-fuchsia-500'>
                    <MessageCircle className='size-5' />
                  </div>
                  <div>
                    <p className='font-bold'>TalkFlow</p>
                    <p className='text-sm text-slate-300'>Live network</p>
                  </div>
                </div>
                <span className='rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-300'>Online</span>
              </div>

              <div className='flex gap-4 overflow-hidden px-5 py-5'>
                {['A', 'S', 'K', 'P', 'M'].map((initial) => (
                  <div key={initial} className='flex size-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-amber-400 via-pink-500 to-indigo-500 p-0.5'>
                    <div className='flex size-full items-center justify-center rounded-full bg-slate-950 font-bold'>{initial}</div>
                  </div>
                ))}
              </div>

              <div className='mx-5 mb-5 rounded-xl border border-white/10 bg-white/[0.06] p-4'>
                <div className='mb-5 flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='flex size-10 items-center justify-center rounded-full bg-indigo-500 font-bold'>T</div>
                    <div>
                      <p className='font-bold'>talkflow.team</p>
                      <p className='text-sm text-slate-300'>Shared a new moment</p>
                    </div>
                  </div>
                  <p className='text-sm text-slate-400'>2m ago</p>
                </div>
                <div className='grid h-64 place-items-center rounded-lg bg-[linear-gradient(135deg,#dbeafe_0%,#fce7f3_54%,#f8fafc_100%)]'>
                  <ThemedLogo className='h-24 w-80' />
                </div>
                <div className='mt-4 flex items-center justify-between text-sm text-slate-300'>
                  <span>124 likes</span>
                  <span>32 comments</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='border-t border-slate-200 bg-white px-5 py-10 sm:px-8'>
        <div className='mx-auto grid max-w-7xl gap-4 sm:grid-cols-3'>
          {stats.map((item) => (
            <div key={item.label} className='flex items-center gap-4 rounded-md border border-slate-200 p-5'>
              <span className={`flex size-11 items-center justify-center rounded-md bg-gradient-to-br ${item.color} text-white`}>
                <item.icon className='size-5' />
              </span>
              <span>
                <span className='block text-2xl font-black text-slate-950'>{item.value}</span>
                <span className='block text-sm text-slate-500'>{item.label}</span>
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Home
