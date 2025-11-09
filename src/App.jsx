import React from 'react';
import { Routes, Route, Link, useNavigate, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import { auth } from './firebaseConfig.js';
import { signOut } from 'firebase/auth';
import { cn } from './design-system/theme.js';

import ProtectedRoute from './components/ProtectedRoute.jsx';
import TeamMemberRoute from './components/TeamMemberRoute.jsx';
import LockGuard from './components/LockGuard.jsx';
import FloatingTimerWidget from './components/FloatingTimerWidget.jsx';
import { useHackathonLock } from './context/HackathonLockContext.jsx';

import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import HackathonsPage from './pages/HackathonsPage.jsx';
import HackathonDetailPage from './pages/HackathonDetailPage.jsx';
import LftPostDetailPage from './pages/LftPostDetailPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import JoinByCodePage from './pages/JoinByCodePage.jsx';
import TeamWorkspacePage from './pages/TeamWorkspacePage.jsx';

function App() {
  const { currentUser } = useAuth();
    const { activeTeam } = useHackathonLock();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (err) { 
      console.error(err); 
    }
  };

  // Nav link base styles
  const navLinkBase = "px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300";
  const navLinkActive = "bg-white/10 text-white";
  const navLinkInactive = "text-gray-400 hover:text-white hover:bg-white/5";
  
  // Toggle button styles (for login/signup)
  const toggleBase = "px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center justify-center";
  const toggleActive = "bg-white text-gray-900 shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-110 z-10";
  const toggleInactive = "text-gray-400 hover:text-white hover:bg-white/5";

  return (
    <div className="min-h-screen w-full bg-[#0a0e17] text-white">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0e17]/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-tr from-green-400 to-blue-500 rounded-lg flex items-center justify-center transform transition group-hover:rotate-12">
              <span className="text-gray-900 font-black text-sm">H</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
              HackOS
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            {/* Public Links */}
            <NavLink 
              to="/" 
              className={({ isActive }) => cn(
                navLinkBase,
                isActive ? navLinkActive : navLinkInactive
              )}
            >
              Home
            </NavLink>
            
            <NavLink 
              to="/hackathons" 
              className={({ isActive }) => cn(
                navLinkBase,
                isActive ? navLinkActive : navLinkInactive
              )}
            >
              Hackathons
            </NavLink>

            {/* Authenticated User Links */}
            {currentUser ? (
              <>
                {/* Divider */}
                <div className="w-px h-6 bg-gray-800 mx-2" />
                
                {/* Dashboard Link */}
                <NavLink 
                  to="/dashboard" 
                  className={({ isActive }) => cn(
                    navLinkBase,
                    isActive 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'text-gray-300 hover:text-green-400'
                  )}
                >
                  Dashboard
                </NavLink>
                
                {/* Profile Link with Avatar */}
                <NavLink 
                  to="/profile" 
                  className={({ isActive }) => cn(
                    "ml-2 flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full border transition-all duration-200",
                    isActive 
                      ? 'bg-white/10 border-white/10' 
                      : 'border-transparent hover:bg-white/5 hover:border-gray-800'
                  )}
                >
                  <img 
                    src={`https://api.dicebear.com/9.x/initials/svg?seed=${currentUser.uid}`} 
                    className="w-6 h-6 rounded-full" 
                    alt="avatar" 
                  />
                  <span className="text-sm font-medium text-gray-300">Profile</span>
                </NavLink>
                
                {/* Logout Button */}
                <button 
                  onClick={handleLogout} 
                  className="ml-2 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-lg transition duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Divider */}
                <div className="w-px h-6 bg-gray-800 mx-4" />
                
                {/* Login/Signup Toggle */}
                <div className="flex items-center bg-black/20 p-1 rounded-full border border-white/5">
                  <NavLink 
                    to="/login" 
                    className={({ isActive }) => cn(
                      toggleBase,
                      isActive ? toggleActive : toggleInactive
                    )}
                  >
                    Login
                  </NavLink>
                  
                  <NavLink 
                    to="/register" 
                    className={({ isActive }) => cn(
                      toggleBase,
                      isActive ? toggleActive : toggleInactive
                    )}
                  >
                    Sign Up
                  </NavLink>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Routes with Lock Guard (blocked when in active hackathon) */}
          <Route element={<LockGuard />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/hackathons" element={<HackathonsPage />} />
            <Route path="/hackathon/:id" element={<HackathonDetailPage />} />
            <Route path="/post/:postId" element={<LftPostDetailPage />} />
            <Route path="/join/:joinCode" element={<JoinByCodePage />} />
            <Route path="/user/:userId" element={<ProfilePage />} />
            
            {/* Protected Routes (require authentication) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
            </Route>
          </Route>
          
          {/* Team Workspace (requires authentication AND team membership) */}
          <Route element={<ProtectedRoute />}>
            <Route element={<TeamMemberRoute />}>
              <Route path="/team/:teamId" element={<TeamWorkspacePage />} />
            </Route>
          </Route>
        </Routes>
      </main>
      <FloatingTimerWidget />
    </div>
  );
}

export default App;