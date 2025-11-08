import React, { useState, useEffect } from 'react';
import { useParams, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

function TeamMemberRoute() {
  const { teamId } = useParams(); // Gets the team ID from the URL
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    const checkMembership = async () => {
      if (!currentUser) {
        // If not logged in, we know they're not a member
        setLoading(false);
        setIsMember(false);
        return;
      }
      
      try {
        // 1. Get the LFT post (which is the "team" document)
        const postRef = doc(db, 'lftPosts', teamId);
        const docSnap = await getDoc(postRef);

        if (docSnap.exists()) {
          const postData = docSnap.data();
          // 2. Check if the user's ID is in the teamMembers array
          if (postData.teamMembers && postData.teamMembers.includes(currentUser.uid)) {
            setIsMember(true);
          } else {
            setIsMember(false);
          }
        } else {
          // Post (team) doesn't exist
          setIsMember(false);
        }
      } catch (err) {
        console.error("Error checking team membership: ", err);
        setIsMember(false);
      } finally {
        setLoading(false);
      }
    };

    checkMembership();
  }, [currentUser, teamId]); // Re-check if the user or teamId changes

  if (loading) {
    return <div className="p-8 text-center text-lg text-green-400">Checking permissions...</div>;
  }

  if (!currentUser) {
    // If they got here while logged out, send to login
    return <Navigate to="/login" replace />;
  }
  
  if (isMember) {
    // 4. If they are a member, show the child page (our Workspace)
    return <Outlet />;
  } else {
    // 5. If they are NOT a member, boot them back to the dashboard
    return <Navigate to="/dashboard" replace />;
  }
}

export default TeamMemberRoute;