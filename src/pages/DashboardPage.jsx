import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { DashboardStatsSkeleton, LftPostSkeleton } from '../components/LoadingSkeletons.jsx';

function DashboardPage() {
  const { currentUser } = useAuth();
  const [activeTeams, setActiveTeams] = useState([]);
  const [pastTeams, setPastTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyTeams = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError('');
      
      try {
        const postsRef = collection(db, 'lftPosts');
        const q = query(postsRef, where("teamMembers", "array-contains", currentUser.uid));
        
        const querySnapshot = await getDocs(q);
        const allTeams = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Sort by newest first
        allTeams.sort((a, b) => {
          const dateA = a.createdAt ? a.createdAt.toDate() : new Date(0);
          const dateB = b.createdAt ? b.createdAt.toDate() : new Date(0);
          return dateB - dateA;
        });

        // SPLIT INTO TWO LISTS based on 'isSubmitted' status
        setActiveTeams(allTeams.filter(team => !team.isSubmitted));
        setPastTeams(allTeams.filter(team => team.isSubmitted));
        
      } catch (err) {
        console.error("Error fetching user's teams: ", err);
        setError('Failed to load your teams. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyTeams();
  }, [currentUser]);

  // Reusable Team Card Component for standardizing the look
  const TeamCard = ({ team, isActive }) => (
    <div className={`group relative bg-gray-800/50 backdrop-blur border rounded-2xl p-6 transition-all duration-300 hover:shadow-xl ${
      isActive 
        ? 'border-green-500/30 hover:border-green-500/60 hover:shadow-green-500/20' 
        : 'border-gray-700 hover:border-gray-600 hover:shadow-gray-500/10'
    }`}>
      {/* Status Indicator Line */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${
        isActive ? 'bg-gradient-to-b from-green-500 to-green-600' : 'bg-gradient-to-b from-gray-600 to-gray-700'
      }`}></div>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 ml-4">
        <div className="flex-1">
          <div className="flex items-start gap-3 mb-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              isActive ? 'bg-green-500/10' : 'bg-gray-700/50'
            }`}>
              {isActive ? (
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-green-400 transition-colors">
                {team.postTitle}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className={isActive ? 'text-green-400 font-semibold' : 'text-gray-400'}>
                  {team.hackathonName}
                </span>
              </div>
            </div>
          </div>
          
          {/* Status Badges */}
          <div className="flex items-center gap-2 ml-15">
            {!isActive && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-700/50 text-gray-300 text-xs font-semibold rounded-lg border border-gray-600">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Completed
              </span>
            )}
            {isActive && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-400 text-xs font-semibold rounded-lg border border-green-500/30">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                In Progress
              </span>
            )}
          </div>
        </div>

        {/* Right Section: Stats & Action Button */}
        <div className="flex flex-col items-end gap-3 shrink-0">
          {isActive && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-700/50 rounded-lg">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="text-sm font-bold text-gray-300">
                {team.teamMembers.length} / {team.maxTeamSize}
              </span>
            </div>
          )}
          <Link
            to={`/team/${team.id}`}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
              isActive
                ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:scale-105'
                : 'bg-gray-700/50 hover:bg-gray-700 text-green-400 hover:text-green-300 border border-gray-600 hover:border-gray-500'
            }`}
          >
            <span>{isActive ? 'Open Workspace' : 'View Project'}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin mb-4"></div>
          <p className="text-xl text-gray-400">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center bg-gray-800/50 backdrop-blur border border-red-500/30 rounded-2xl p-12 max-w-md">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Oops!</h2>
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Page Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center border border-gray-700">
              <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">My Dashboard</h1>
              <p className="text-gray-400 mt-1">Track your hackathon journey and manage your projects</p>
            </div>
          </div>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{activeTeams.length}</p>
                  <p className="text-xs text-gray-400">Active Projects</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{pastTeams.length}</p>
                  <p className="text-xs text-gray-400">Completed</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{activeTeams.length + pastTeams.length}</p>
                  <p className="text-xs text-gray-400">Total Projects</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- SECTION 1: ACTIVE HACKATHONS --- */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🚀</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Active Hackathons</h2>
              <p className="text-sm text-gray-400">Projects you're currently working on</p>
            </div>
          </div>
          
          {activeTeams.length > 0 ? (
            <div className="space-y-4">
              {activeTeams.map(team => <TeamCard key={team.id} team={team} isActive={true} />)}
            </div>
          ) : (
            <div className="bg-gray-800/30 backdrop-blur border-2 border-dashed border-gray-700 rounded-2xl p-12 text-center">
              <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-300 mb-2">No Active Hackathons</h3>
              <p className="text-gray-500 mb-6">Start your journey and join an exciting hackathon today!</p>
              <Link 
                to="/hackathons" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Find Your Next Challenge
              </Link>
            </div>
          )}
        </div>

        {/* --- SECTION 2: PAST HACKATHONS --- */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🏆</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Past Achievements</h2>
              <p className="text-sm text-gray-400">Your completed projects and submissions</p>
            </div>
          </div>
          
          {pastTeams.length > 0 ? (
            <div className="space-y-4">
              {pastTeams.map(team => <TeamCard key={team.id} team={team} isActive={false} />)}
            </div>
          ) : (
            <div className="bg-gray-800/20 backdrop-blur border border-gray-800 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-500 italic">No completed projects yet. Keep building!</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default DashboardPage;