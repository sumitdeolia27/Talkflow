import React from 'react'
import { assets } from '../assets/assets'

const ThemedLogo = ({ className = '', onClick }) => {
  return (
    <span className={`theme-logo inline-block ${className}`}>
      <img
        onClick={onClick}
        src={assets.logoLight}
        className='theme-logo-light h-full w-full cursor-inherit object-contain'
        alt='TalkFlow'
      />
      <img
        onClick={onClick}
        src={assets.logoDark}
        className='theme-logo-dark h-full w-full cursor-inherit object-contain'
        alt='TalkFlow'
      />
    </span>
  )
}

export default ThemedLogo
