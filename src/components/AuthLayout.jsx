import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AnimatedMascots from './AnimatedMascots';

function AuthLayout({ children, title, subtitle, isTypingPassword = false, showPassword = false, loginState = 'idle' }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      // Calculate mouse position relative to the left animation container
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    // Only track mouse if we are on a screen wide enough to show the mascots
    if (window.innerWidth >= 1024) {
       window.addEventListener('mousemove', handleMouseMove);
    }
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen w-full flex bg-[#0a0e17]">
      
      {/* LEFT COLUMN: Mascot Stage */}
      <div ref={containerRef} className="hidden lg:flex lg:w-1/2 bg-[#0f172a] relative overflow-hidden border-r border-white/5">
        <AnimatedMascots 
            mousePos={mousePos}
            isTypingPassword={isTypingPassword}
            showPassword={showPassword}
            loginState={loginState}
        />
      </div>

      {/* RIGHT COLUMN: Form Area */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-16 bg-[#0a0e17]">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <Link to="/" className="inline-flex items-center gap-2 group mb-8">
              <div className="w-10 h-10 bg-gradient-to-tr from-green-400 to-blue-500 rounded-xl flex items-center justify-center transform transition group-hover:rotate-12 shadow-lg shadow-green-500/20">
                <span className="text-gray-900 font-black text-lg">H</span>
              </div>
              <span className="text-2xl font-bold text-white">HackOS</span>
            </Link>
            <h2 className="text-3xl font-bold text-white mt-4">{title}</h2>
            <p className="mt-2 text-gray-400">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;