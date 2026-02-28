import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';

import FloatingTimerWidget from './components/FloatingTimerWidget.jsx';
import NeoSidebar from './components/NeoSidebar.jsx';

import ProtectedRoute from './components/ProtectedRoute.jsx';
import TeamMemberRoute from './components/TeamMemberRoute.jsx';
import LockGuard from './components/LockGuard.jsx';

/* ================================
   🔥 Lazy Loaded Pages (Code Split)
================================ */

const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const RegisterPage = lazy(() => import('./pages/RegisterPage.jsx'));
const ProfilePage = lazy(() => import('./pages/ProfilePage.jsx'));
const HackathonsPage = lazy(() => import('./pages/HackathonsPage.jsx'));
const HackathonDetailPage = lazy(() => import('./pages/HackathonDetailPage.jsx'));
const LftPostDetailPage = lazy(() => import('./pages/LftPostDetailPage.jsx'));
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'));
const JoinByCodePage = lazy(() => import('./pages/JoinByCodePage.jsx'));
const TeamWorkspacePage = lazy(() => import('./pages/TeamWorkspacePage.jsx'));

function App() {
  const { currentUser } = useAuth();

  return (
    <div className="flex min-h-screen w-full bg-[#030712] text-white selection:bg-cyan-500/30 selection:text-cyan-200">

      {/* Sidebar */}
      <NeoSidebar />

      {/* Content Wrapper */}
      <div className="flex-1 transition-all duration-500 ml-20 md:ml-64">

        <main className="min-h-screen p-4 md:p-8">

          {/* 🔥 Suspense Wrapper for Lazy Routes */}
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-screen text-cyan-400 text-lg font-semibold">
                Loading...
              </div>
            }
          >
            <Routes>

              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* LockGuard Routes */}
              <Route element={<LockGuard />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/hackathons" element={<HackathonsPage />} />
                <Route path="/hackathon/:id" element={<HackathonDetailPage />} />
                <Route path="/post/:postId" element={<LftPostDetailPage />} />
                <Route path="/join/:joinCode" element={<JoinByCodePage />} />
                <Route path="/user/:userId" element={<ProfilePage />} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                </Route>
              </Route>

              {/* Team Workspace */}
              <Route element={<ProtectedRoute />}>
                <Route element={<TeamMemberRoute />}>
                  <Route path="/team/:teamId" element={<TeamWorkspacePage />} />
                </Route>
              </Route>

            </Routes>
          </Suspense>

        </main>
      </div>

      <FloatingTimerWidget />
    </div>
  );
}

export default App;