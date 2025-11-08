import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    // If no user is logged in, redirect them to the /login page
    return <Navigate to="/login" replace />;
  }

  // If a user IS logged in, show the child component (e.g., ProfilePage)
  return <Outlet />;
}

export default ProtectedRoute;