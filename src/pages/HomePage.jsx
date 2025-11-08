import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom'; // 1. Import Link

function HomePage() {
  const { currentUser } = useAuth();

  return (
    <div className="p-8">
      
      {currentUser ? (
        // If user IS logged in:
        <div>
          <h1 className="text-3xl font-bold">Welcome back, <span className="text-green-400">{currentUser.email}</span>!</h1>
          <p className="mt-4 text-gray-300">
            You are logged in. You can now access your dashboard and teams.
          </p>
          
          {/* 2. Add a clear link to the profile page */}
          <div className="mt-8">
            <Link 
              to="/profile"
              className="px-6 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-bold transition duration-300"
            >
              Update Your Profile
            </Link>
          </div>
        </div>
      ) : (
        // If user IS NOT logged in:
        <div>
          <h1 className="text-3xl font-bold">Welcome to the Hackathon Platform</h1>
          <p className="mt-4 text-gray-300">
            The all-in-one place to find teammates, build your project, and win.
          </p>
          <p className="mt-2 text-gray-400">
            Please login or register to get started.
          </p>
        </div>
      )}

    </div>
  );
}

export default HomePage;