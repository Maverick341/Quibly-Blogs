import React from 'react'
import { SignupComponent, Container } from '@/Components'

function Signup() {
  return (
    <div className='min-h-screen bg-[#f5f4f0] text-[#1f2226] dark:bg-[#2a2d31] dark:text-[#e8e6e3] font-sans flex items-center justify-center'>
      <Container>
        <div className="w-full max-w-sm">
          <div className="w-full border border-[#ccc6bb] dark:border-[#3f4347] rounded-lg bg-[#f7f5f2] dark:bg-[#24272b] shadow-auth-light dark:shadow-auth-dark">
            <SignupComponent />
          </div>
        </div>
      </Container>
    </div>

    // <div className='min-h-screen bg-[#2a2d31] text-[#e8e6e3] font-sans flex items-center justify-center px-4'>
    //   <div className="w-full max-w-md rounded-lg shadow-[rgba(50,50,93,0.25)_0px_2px_5px_-1px,rgba(0,0,0,0.3)_0px_1px_3px_-1px]">
    //     <SignupComponent />
    //   </div>
    // </div>
  )
}

export default Signup