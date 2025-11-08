import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

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
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex justify-between items-center border-l-4 border-green-500">
      <div>
        <h3 className="text-2xl font-semibold text-white">{team.postTitle}</h3>
        <p className="text-gray-400 mt-1">
          Event: <span className="font-medium text-green-400">{team.hackathonName}</span>
        </p>
        {!isActive && (
          <span className="inline-block mt-2 px-2 py-1 bg-gray-700 text-xs rounded-full text-gray-300">
            Completed
          </span>
        )}
      </div>
      <div className="text-right flex flex-col items-end gap-2">
        {isActive && (
           <div className="text-sm font-bold text-gray-400">
             Members: {team.teamMembers.length} / {team.maxTeamSize}
           </div>
        )}
        <Link
          to={`/team/${team.id}`} 
          className={`px-5 py-2 rounded-lg font-bold transition duration-300 ${isActive ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-green-400'}`}
        >
          {isActive ? 'Open Workspace' : 'View Project'}
        </Link>
      </div>
    </div>
  );

  if (loading) return <div className="p-8 text-center text-lg text-green-400">Loading Dashboard...</div>;
  if (error) return <div className="p-8 text-center text-lg text-red-500">{error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8 border-b border-gray-800 pb-4">My Dashboard</h1>

      {/* --- SECTION 1: ACTIVE HACKATHONS --- */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <span className="text-3xl">🚀</span> Active Hackathons
        </h2>
        {activeTeams.length > 0 ? (
          <div className="space-y-4">
            {activeTeams.map(team => <TeamCard key={team.id} team={team} isActive={true} />)}
          </div>
        ) : (
          <div className="bg-gray-800/50 p-8 rounded-xl text-center border-2 border-dashed border-gray-700">
            <p className="text-gray-400 text-lg mb-4">You have no active hackathons.</p>
            <Link to="/hackathons" className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition">
              Find Your Next Challenge
            </Link>
          </div>
        )}
      </div>

      {/* --- SECTION 2: PAST HACKATHONS --- */}
      <div>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <span className="text-3xl">🏆</span> Past Achievements
        </h2>
        {pastTeams.length > 0 ? (
          <div className="space-y-4 opacity-80 hover:opacity-100 transition-opacity">
            {pastTeams.map(team => <TeamCard key={team.id} team={team} isActive={false} />)}
          </div>
        ) : (
          <p className="text-gray-500 italic">No completed projects yet. Keep building!</p>
        )}
      </div>

    </div>
  );
}

export default DashboardPage;