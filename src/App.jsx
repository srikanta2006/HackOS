import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import { auth } from './firebaseConfig.js';
import { signOut } from 'firebase/auth';

// --- ROUTE GUARDS ---
import ProtectedRoute from './components/ProtectedRoute.jsx';
import TeamMemberRoute from './components/TeamMemberRoute.jsx';
import LockGuard from './components/LockGuard.jsx';

// --- PAGES ---
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
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white">
      
      {/* --- NAVIGATION BAR --- */}
      <nav className="bg-gray-800 p-4 shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-green-400">
            HCP
          </Link>
          
          <div className="flex gap-4 items-center">
            <Link to="/" className="px-3 py-2 rounded-md hover:bg-gray-700">Home</Link>
            <Link to="/hackathons" className="px-3 py-2 rounded-md hover:bg-gray-700">
              Hackathons
            </Link>
            
            {currentUser ? (
              // Logged In View
              <>
                <Link
                  to="/dashboard"
                  className="px-4 py-2 rounded-md bg-green-500 text-white font-bold hover:bg-green-600"
                >
                  Dashboard
                </Link>
                <Link 
                  to="/profile" 
                  className="px-3 py-2 rounded-md text-gray-300 hover:bg-gray-700"
                >
                  My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white font-bold"
                >
                  Logout
                </button>
              </>
            ) : (
              // Logged Out View
              <>
                <Link to="/login" className="px-3 py-2 rounded-md hover:bg-gray-700">Login</Link>
                <Link to="/register" className="px-3 py-2 rounded-md hover:bg-gray-700">Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="container mx-auto">
        <Routes>
          {/* 1. Public Routes (Never Locked) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* 2. Routes Locked during Active Hackathon */}
          {/* If a timer is running, visiting these will redirect you to your workspace */}
          <Route element={<LockGuard />}>
              {/* Public-ish pages */}
              <Route path="/" element={<HomePage />} />
              <Route path="/hackathons" element={<HackathonsPage />} />
              <Route path="/hackathon/:id" element={<HackathonDetailPage />} />
              <Route path="/post/:postId" element={<LftPostDetailPage />} />
              <Route path="/join/:joinCode" element={<JoinByCodePage />} />
              <Route path="/user/:userId" element={<ProfilePage />} />

              {/* Private pages that also get locked */}
              <Route element={<ProtectedRoute />}>
                 <Route path="/profile" element={<ProfilePage />} />
                 <Route path="/dashboard" element={<DashboardPage />} />
              </Route>
          </Route>

          {/* 3. The Workspace (ALWAYS Accessible if Member) */}
          <Route element={<ProtectedRoute />}>
            <Route element={<TeamMemberRoute />}>
               <Route path="/team/:teamId" element={<TeamWorkspacePage />} />
            </Route>
          </Route>
          
        </Routes>
      </main>

    </div>
  );
}

export default App;