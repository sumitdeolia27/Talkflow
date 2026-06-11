import React, { useMemo, useState } from 'react'
import { assets } from '../assets/assets'
import ThemedLogo from '../components/ThemedLogo'
import { ArrowLeft, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  updateProfile,
} from 'firebase/auth'
import { Link, useSearchParams } from 'react-router-dom'
  }

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
    toast.success('Signed in with Google')
    setLoading(true)

    try {
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({ prompt: 'select_account' })
      await signInWithPopup(auth, provider)
      toast.success('Signed in with Google')
    } catch (error) {
      if (
        error.code === 'auth/popup-closed-by-user' ||
        error.code === 'auth/popup-blocked' ||
        error.code === 'auth/cancelled-popup-request'
      ) {
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({ prompt: 'select_account' })
        await signInWithRedirect(auth, provider)
        return
      }

      if (error.code === 'auth/unauthorized-domain') {
        toast.error('Add this Vercel domain in Firebase Authorized domains.')
      } else if (error.code === 'auth/configuration-not-found') {
        toast.error('Enable Google sign-in in Firebase Authentication.')
      } else {
        toast.error(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await handleEmailSubmit()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const switchMode = () => {
    setIsSignUp((value) => !value)
    setPassword('')
    setConfirmPassword('')
  }

  return (
    <main className='min-h-screen bg-slate-100 text-slate-950'>
      <div className='grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]'>
        <section className='relative hidden overflow-hidden bg-slate-950 lg:block'>
          <img src={assets.bgImage} alt='TalkFlow community' className='absolute inset-0 h-full w-full object-cover opacity-80' />
          <div className='absolute inset-0 bg-slate-950/45' />
          <div className='relative flex h-full flex-col justify-between p-10 text-white'>
            <Link to='/' className='inline-flex w-fit items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm font-medium backdrop-blur hover:bg-white/15'>
              <ArrowLeft className='size-4' />
              Home
            </Link>
            <div className='max-w-xl'>
              <ThemedLogo className='mb-8 h-24 w-80' />
              <p className='mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-400/15 px-3 py-1 text-sm font-medium text-emerald-100'>
                <ShieldCheck className='size-4' />
                Secure social sign-in
              </p>
              <h1 className='text-5xl font-bold leading-tight tracking-normal'>
                Keep your people, posts, and chats in one place.
              </h1>
              <p className='mt-5 text-lg leading-8 text-slate-200'>
                Login with email or Google and jump back into your network.
              </p>
            </div>
            <div className='grid grid-cols-3 gap-3 text-sm text-slate-200'>
              <p className='rounded-md bg-white/10 p-3 backdrop-blur'>Posts</p>
              <p className='rounded-md bg-white/10 p-3 backdrop-blur'>Messages</p>
              <p className='rounded-md bg-white/10 p-3 backdrop-blur'>Connections</p>
            </div>
          </div>
        </section>
