import React from "react";
import { LoginComponent, Container } from "@/Components";

function Login() {
  return (
    <div className='min-h-screen bg-[#2a2d31] text-[#e8e6e3] font-sans flex items-center justify-center'>
      <Container>
        <div className="w-full max-w-md">
          <div className="w-full max-w-md rounded-lg shadow-[rgba(50,50,93,0.25)_0px_2px_5px_-1px,rgba(0,0,0,0.3)_0px_1px_3px_-1px]">
            <LoginComponent />
          </div>
        </div>
      </Container>
    </div>

    // <div className="min-h-screen bg-[#2a2d31] text-[#e8e6e3] font-sans flex items-center justify-center px-4">
    //   <div className="w-full max-w-md rounded-lg shadow-[rgba(50,50,93,0.25)_0px_2px_5px_-1px,rgba(0,0,0,0.3)_0px_1px_3px_-1px]">
    //     <LoginComponent />
    //   </div>
    // </div>
  );
}

export default Login;
