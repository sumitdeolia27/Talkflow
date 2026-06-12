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
import { auth } from '../config/firebase'
import toast from 'react-hot-toast'

const Login = () => {
  const [searchParams] = useSearchParams()
  const [isSignUp, setIsSignUp] = useState(searchParams.get('mode') === 'signup')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const authTitle = useMemo(() => (
    isSignUp ? 'Create your account' : 'Welcome back'
  ), [isSignUp])

  const handleFirebaseError = (error) => {
    if (error.code === 'auth/unauthorized-domain') {
      toast.error('Add this Vercel domain in Firebase Authorized domains.')
      return
    }

    if (error.code === 'auth/configuration-not-found') {
      toast.error('Enable this sign-in method in Firebase Authentication.')
      return
    }

    if (error.code === 'auth/invalid-credential') {
      toast.error('Invalid email or password.')
      return
    }

    toast.error(error.message || 'Authentication failed.')
  }

  const handleEmailSubmit = async () => {
    if (isSignUp && password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (isSignUp) {
      const { user } = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(user, { displayName: fullName })
      toast.success('Account created successfully')
      return
    }

    await signInWithEmailAndPassword(auth, email, password)
    toast.success('Signed in successfully')
  }

  const handleGoogleSignIn = async () => {
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

      handleFirebaseError(error)
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
      handleFirebaseError(error)
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

        <section className='flex items-center justify-center px-5 py-8 sm:px-8'>
          <div className='w-full max-w-md'>
            <div className='mb-8 flex items-center justify-between lg:hidden'>
              <Link to='/'><ThemedLogo className='h-16 w-56' /></Link>
              <Link to='/' className='text-sm font-medium text-slate-600'>Home</Link>
            </div>

            <form onSubmit={handleSubmit} className='rounded-md border border-slate-200 bg-white p-6 shadow-xl sm:p-8'>
              <div className='mb-6'>
                <p className='text-sm font-semibold uppercase tracking-wide text-indigo-600'>TalkFlow account</p>
                <h2 className='mt-2 text-3xl font-bold text-slate-950'>{authTitle}</h2>
                <p className='mt-2 text-sm leading-6 text-slate-500'>
                  Use the same account whenever you return.
                </p>
              </div>

              <div className='space-y-4'>
                {isSignUp && (
                  <input type='text' placeholder='Full name' value={fullName} onChange={(e) => setFullName(e.target.value)} required className='w-full rounded-md border border-slate-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100' />
                )}

                <input type='email' placeholder='Email address' value={email} onChange={(e) => setEmail(e.target.value)} required className='w-full rounded-md border border-slate-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100' />

                <div className='relative'>
                  <input type={showPassword ? 'text' : 'password'} placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className='w-full rounded-md border border-slate-300 px-4 py-3 pr-11 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100' />
                  <button type='button' onClick={() => setShowPassword((value) => !value)} className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-500'>
                    {showPassword ? <EyeOff className='size-5' /> : <Eye className='size-5' />}
                  </button>
                </div>

                {isSignUp && (
                  <div className='relative'>
                    <input type={showConfirmPassword ? 'text' : 'password'} placeholder='Confirm password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} className='w-full rounded-md border border-slate-300 px-4 py-3 pr-11 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100' />
                    <button type='button' onClick={() => setShowConfirmPassword((value) => !value)} className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-500'>
                      {showConfirmPassword ? <EyeOff className='size-5' /> : <Eye className='size-5' />}
                    </button>
                  </div>
                )}
              </div>

              <button type='submit' disabled={loading} className='mt-5 w-full rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60'>
                {loading ? 'Please wait...' : isSignUp ? 'Create account' : 'Sign in'}
              </button>

              <div className='my-5 flex items-center gap-3 text-xs text-slate-400'>
                <span className='h-px flex-1 bg-slate-200' />
                or
                <span className='h-px flex-1 bg-slate-200' />
              </div>

              <button type='button' onClick={handleGoogleSignIn} disabled={loading} className='w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800 hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-60'>
                {loading ? 'Please wait...' : 'Continue with Google'}
              </button>

              <p className='mt-6 text-center text-sm text-slate-600'>
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button type='button' onClick={switchMode} className='font-semibold text-indigo-600 hover:text-indigo-700'>
                  {isSignUp ? 'Sign in' : 'Create one'}
                </button>
              </p>
            </form>
          </div>
        </section>
      </div>
    </main>
  )
}

export default Login
