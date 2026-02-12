import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import FloatingTimerWidget from './components/FloatingTimerWidget.jsx';
import NeoSidebar from './components/NeoSidebar.jsx';

import ProtectedRoute from './components/ProtectedRoute.jsx';
import TeamMemberRoute from './components/TeamMemberRoute.jsx';
import LockGuard from './components/LockGuard.jsx';

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
  const [sidebarWidth, setSidebarWidth] = useState('w-64'); // We'll sync this if needed, but for now simple 64/20

  return (
    <div className="flex min-h-screen w-full bg-[#030712] text-white selection:bg-cyan-500/30 selection:text-cyan-200">

      {/* Sidebar - Persistent Global Navigation */}
      <NeoSidebar />

      {/* Content Wrapper */}
      {/* We add margin-left to prevent overlap. On mobile, we might need a different approach later. */}
      {/* For MVP Neo, we focus on the desktop 'Command Center' feel first. */}
      <div className="flex-1 transition-all duration-500 ml-20 md:ml-64">

        {/* Main Viewport */}
        <main className="min-h-screen p-4 md:p-8">
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
      </div>

      <FloatingTimerWidget />
    </div>
  );
}

export default App;