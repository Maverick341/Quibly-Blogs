import React from 'react'
import quiblyLogo from '@/assets/Quibly.png'

function Logo({width = '100px'}) {
  return (
    <div className="overflow-hidden flex items-center" style={{ width, height: '40px' }}>
      <img 
        src={quiblyLogo} 
        alt="Quibly" 
        className="h-full w-full object-cover object-center scale-120"
      />
    </div>
  )
}

export default Logo