import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';

// 1. Create the context
const AuthContext = createContext();

// 2. Create a "hook" to make it easy to use this context
export function useAuth() {
  return useContext(AuthContext);
}

// 3. Create the "Provider" component
// This component will wrap our entire app and manage the auth state
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // To check if auth state is loaded

  // This effect runs once when the component mounts
  useEffect(() => {
    // onAuthStateChanged is a Firebase listener
    // It runs whenever the user logs in or out
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false); // We're done loading
    });

    // Cleanup function to remove the listener
    return unsubscribe;
  }, []); // Empty array means this effect runs only once

  // This is the data we're "providing" to the whole app
  const value = {
    currentUser
  };

  // We don't render anything until we're done checking who is logged in
  // This prevents the app from "flickering" between login/logout states
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}