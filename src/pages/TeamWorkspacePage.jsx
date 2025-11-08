import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebaseConfig.js';
import { doc, onSnapshot, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext.jsx';

// --- IMPORTING WORKSPACE COMPONENTS ---
import TeamChat from '../components/TeamChat.jsx';
import TaskHub from '../components/TaskHub.jsx';
import DesignHub from '../components/DesignHub.jsx';
import TeamKnowledgeBase from '../components/TeamKnowledgeBase.jsx';
import TeamResearch from '../components/TeamResearch.jsx';

// --- IMPORTING MODALS & TIMER ---
import StartHackathonModal from '../components/StartHackathonModal.jsx';
import HackathonTimer from '../components/HackathonTimer.jsx';
// Re-import TaskProgressBar if you want to keep it at the top
import TaskProgressBar from '../components/TaskProgressBar.jsx'; 

function TeamWorkspacePage() {
  const { teamId } = useParams();
  const { currentUser } = useAuth();

  const [team, setTeam] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('chat');
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);

  // 1. Real-time listener for team data
  useEffect(() => {
    const postRef = doc(db, 'lftPosts', teamId);
    const unsubscribe = onSnapshot(postRef, (docSnap) => {
      if (docSnap.exists()) {
        setTeam({ id: docSnap.id, ...docSnap.data() });
      } else {
        setError('Team workspace not found.');
      }
    }, (err) => {
      console.error("Error listening to team: ", err);
      setError('Failed to load team data.');
      setLoading(false);
    });
    return () => unsubscribe();
  }, [teamId]);

  // 2. Fetch team member profiles
  useEffect(() => {
    const fetchTeamMembers = async () => {
      if (team && team.teamMembers.length > 0) {
        setLoading(true);
        const memberPromises = team.teamMembers.map(async (userId) => {
          const userDocRef = doc(db, 'users', userId);
          const userDocSnap = await getDoc(userDocRef);
          return userDocSnap.exists() ? 
            { id: userDocSnap.id, ...userDocSnap.data() } : 
            { id: userId, email: 'Unknown User' };
        });
        const membersData = await Promise.all(memberPromises);
        setTeamMembers(membersData);
      } else {
        setTeamMembers([]);
      }
      setLoading(false);
    };
    fetchTeamMembers();
  }, [team]);

  // 3. Handle Project Submission
  const handleSubmitProject = async () => {
    const projectLink = window.prompt("Step 1/2: Enter the full URL to your project (GitHub, Demo, etc.):");
    if (!projectLink || projectLink.trim() === '') return;

    const finalDescription = window.prompt("Step 2/2: Enter a short final description of what you built:");
    if (!finalDescription || finalDescription.trim() === '') return;

    try {
      const teamRef = doc(db, 'lftPosts', teamId);
      await updateDoc(teamRef, {
        projectLink: projectLink,
        finalDescription: finalDescription,
        isSubmitted: true,
        // Optional: End timer immediately upon submission
        hackathonEndsAt: Timestamp.now() 
      });
      alert("Project submitted successfully!");
    } catch (err) {
      console.error("Error submitting project: ", err);
      alert("Failed to submit project. Please try again.");
    }
  };

  if (loading) return <div className="p-8 text-center text-lg text-green-400">Loading Workspace...</div>;
  if (error) return <div className="p-8 text-center text-lg text-red-500">{error}</div>;
  if (!team) return null;

  const isCreator = currentUser && team.creatorId === currentUser.uid;
  const displayTitle = team.projectName || team.postTitle;

  // --- CALCULATE STATES ---
  const isExpired = team.hackathonEndsAt && team.hackathonEndsAt.toMillis() < Date.now();
  const isHackathonActive = team.hackathonStartedAt && !team.isSubmitted && !isExpired;
  // Workspace is FROZEN if it is submitted OR if time has run out
  const isReadOnly = team.isSubmitted || isExpired;

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col overflow-hidden bg-gray-950">
      
      {/* Progress Bar at top */}
      <TaskProgressBar teamId={teamId} />

      <div className="flex-1 flex flex-col overflow-hidden p-6">
          
          {/* --- HEADER --- */}
          <div className="mb-6 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-4">
                <div>
                    <p className="text-gray-400 text-sm">Workspace for:</p>
                    <h1 className="text-3xl font-bold text-green-400 leading-tight">{displayTitle}</h1>
                </div>
                
                {/* Timer Display (only if active) */}
                {isHackathonActive && team.hackathonEndsAt && (
                     <div className="ml-8">
                         <HackathonTimer endsAt={team.hackathonEndsAt} />
                     </div>
                )}

                {/* Frozen/Submitted Badge */}
                {isReadOnly && (
                  <span className={`text-white text-xs font-bold px-3 py-1 rounded-full self-start mt-6 ml-4 flex items-center gap-2 ${team.isSubmitted ? 'bg-green-500' : 'bg-red-500'}`}>
                    {team.isSubmitted ? 'PROJECT SUBMITTED' : 'TIME EXPIRED - FROZEN'}
                  </span>
                )}
            </div>
            
            <div className="flex items-center gap-6">
               {/* Start Button */}
               {!team.hackathonStartedAt && isCreator && (
                 <button onClick={() => setIsStartModalOpen(true)} className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold transition duration-300 flex items-center gap-2 animate-pulse">
                   <span>⏱️</span> Start Hackathon
                 </button>
               )}

               {/* Submit/View Button */}
               {team.isSubmitted ? (
                 <a href={team.projectLink} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-bold transition duration-300">View Project →</a>
               ) : (team.hackathonStartedAt && isCreator && !isExpired) ? (
                 <button onClick={handleSubmitProject} className="px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold transition duration-300">🏆 Submit Project</button>
               ) : null}

              <Link to={`/hackathon/${team.hackathonId}`} className="text-blue-400 hover:underline">&larr; Back</Link>
            </div>
          </div>

          {/* --- MAIN LAYOUT --- */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
             <div className="lg:col-span-3 bg-gray-800 rounded-lg shadow-xl overflow-hidden flex flex-col">
                 <div className="flex border-b border-gray-700 shrink-0 overflow-x-auto no-scrollbar">
                     {['chat', 'tasks', 'design', 'docs', 'research'].map(tab => (
                      <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-4 text-center font-bold transition whitespace-nowrap capitalize ${activeTab === tab ? 'bg-gray-700 text-green-400 border-b-4 border-green-400' : 'text-gray-400 hover:bg-gray-750'}`}>{tab === 'chat' ? '💬 Team Chat' : tab === 'tasks' ? '✅ Task Hub' : tab === 'design' ? '🛠️ Design Hub' : tab === 'docs' ? '📚 Knowledge Base' : '🧠 AI Research'}</button>
                    ))}
                 </div>
                 <div className="flex-1 overflow-hidden bg-gray-900">
                    {/* PASSING isReadOnly DOWN TO ALL COMPONENTS */}
                    {activeTab === 'chat' && <div className="h-full"><TeamChat teamId={teamId} isReadOnly={isReadOnly} /></div>}
                    {activeTab === 'tasks' && <div className="h-full"><TaskHub teamId={teamId} teamMembers={teamMembers} isReadOnly={isReadOnly} /></div>}
                    {activeTab === 'design' && <div className="h-full"><DesignHub teamId={teamId} isReadOnly={isReadOnly} /></div>}
                    {activeTab === 'docs' && <div className="h-full"><TeamKnowledgeBase teamId={teamId} isReadOnly={isReadOnly} /></div>}
                    {activeTab === 'research' && <div className="h-full"><TeamResearch teamId={teamId} isReadOnly={isReadOnly} /></div>}
                 </div>
             </div>
             <div className="lg:col-span-1 bg-gray-800 p-6 rounded-lg shadow-xl h-fit overflow-y-auto max-h-full">
                  <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Team Members ({teamMembers.length}/{team.maxTeamSize})</h2>
                  <div className="space-y-4">
                    {teamMembers.map((member) => (
                      <div key={member.id} className="flex items-center gap-3">
                        <img src={member.photoURL || `https://api.dicebear.com/9.x/initials/svg?seed=${member.id}`} alt="" className="w-10 h-10 rounded-full bg-gray-600" />
                        <div className="overflow-hidden">
                          <p className="font-medium text-gray-200 truncate">{member.displayName || member.email}</p>
                          {team.creatorId === member.id && <span className="text-xs text-green-400 font-bold">Team Lead</span>}
                        </div>
                      </div>
                    ))}
                  </div>
             </div>
          </div>
      </div>

      {isStartModalOpen && <StartHackathonModal teamId={teamId} onClose={() => setIsStartModalOpen(false)} />}

    </div>
  );
}

export default TeamWorkspacePage;