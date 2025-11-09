import React from 'react';
import { useAuth } from '../context/AuthContext.jsx'; // Added .jsx extension here
import { Link } from 'react-router-dom';

function HomePage() {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-[#0a0e17] via-gray-900 to-[#0f172a]">
      {currentUser ? (
        // --- LOGGED IN VIEW ---
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Welcome Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full mb-6">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-green-400 text-sm font-semibold">Active Session</span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Welcome back!
            </h1>
            <p className="text-xl text-gray-400 mb-2">
              Logged in as <span className="text-green-400 font-semibold">{currentUser.email}</span>
            </p>
            <p className="text-gray-500">Ready to build something amazing today?</p>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <Link 
              to="/profile"
              className="group bg-gray-800/30 backdrop-blur-md border border-gray-700/50 rounded-2xl p-8 hover:bg-gray-800/50 hover:border-green-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/10 hover:-translate-y-1"
            >
              <div className="w-14 h-14 bg-green-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-500/20 transition-colors">
                <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Your Profile</h3>
              <p className="text-gray-400 text-sm">Showcase your skills and past projects to find the perfect team.</p>
              <div className="mt-6 text-green-400 text-sm font-bold flex items-center">
                Update Profile 
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>

            <Link 
              to="/dashboard"
              className="group bg-gray-800/30 backdrop-blur-md border border-gray-700/50 rounded-2xl p-8 hover:bg-gray-800/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1"
            >
              <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Dashboard</h3>
              <p className="text-gray-400 text-sm">Access your active workspaces, tasks, and team chats in one place.</p>
              <div className="mt-6 text-blue-400 text-sm font-bold flex items-center">
                Go to Dashboard
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>

            <Link 
              to="/hackathons"
              className="group bg-gray-800/30 backdrop-blur-md border border-gray-700/50 rounded-2xl p-8 hover:bg-gray-800/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1"
            >
              <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors">
                <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Find Hackathons</h3>
              <p className="text-gray-400 text-sm">Browse upcoming events and find a team looking for your skills.</p>
              <div className="mt-6 text-purple-400 text-sm font-bold flex items-center">
                Explore Events
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>
          </div>

        </div>
      ) : (
        // --- LOGGED OUT VIEW ---
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          {/* Hero Section */}
          <div className="text-center mb-24">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full mb-8">
              <span className="text-green-400 text-sm font-bold">🚀 Launch Your Next Big Idea</span>
            </div>
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-black mb-8 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent leading-none tracking-tight">
              Build faster,<br />together.
            </h1>
            <p className="text-xl sm:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              The all-in-one platform to find teammates, manage your hackathon projects, and ship winning products.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                to="/register"
                className="px-10 py-4 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-lg transition-all duration-300 shadow-xl shadow-green-500/20 hover:shadow-green-500/40 hover:scale-105 flex items-center gap-2"
              >
                Start Building Free
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link 
                to="/login"
                className="px-10 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-lg transition-all duration-300 border border-white/10 hover:border-white/30"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-24">
            <div className="bg-gradient-to-b from-gray-800/40 to-gray-900/40 backdrop-blur-md border border-gray-800 rounded-3xl p-8">
              <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mb-8 border border-green-500/20">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Find Your Dream Team</h3>
              <p className="text-gray-400 leading-relaxed">
                Don't hack alone. Browse open roles, connect with talented developers and designers, and form the perfect squad in minutes.
              </p>
            </div>

            <div className="bg-gradient-to-b from-gray-800/40 to-gray-900/40 backdrop-blur-md border border-gray-800 rounded-3xl p-8">
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-8 border border-blue-500/20">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Integrated Workspace</h3>
              <p className="text-gray-400 leading-relaxed">
                Everything you need to win: Real-time chat, Kanban task boards, and integrated professional tools like Figma and Draw.io.
              </p>
            </div>

            <div className="bg-gradient-to-b from-gray-800/40 to-gray-900/40 backdrop-blur-md border border-gray-800 rounded-3xl p-8">
              <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-8 border border-purple-500/20">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Showcase & Win</h3>
              <p className="text-gray-400 leading-relaxed">
                Build your portfolio automatically. Submit your projects, get them verified, and show off your wins to the world.
              </p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

export default HomePage;