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
import SubmitProjectModal from '../components/SubmitProjectModal.jsx';
import { WorkspaceLoading } from '../components/LoadingSkeletons.jsx';

// --- IMPORTING MODALS & TIMER ---
import StartHackathonModal from '../components/StartHackathonModal.jsx';
import HackathonTimer from '../components/HackathonTimer.jsx';
import TaskProgressBar from '../components/TaskProgressBar.jsx'; 

function TeamWorkspacePage() {
  const { teamId } = useParams();
  const { currentUser } = useAuth();

  const [team, setTeam] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('chat');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
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
 const handleSubmitProject = () => {
  setIsSubmitModalOpen(true);
};

  if (loading) return <WorkspaceLoading />;

  if (error) {
    return (
      <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center bg-gray-800/50 backdrop-blur border border-red-500/30 rounded-2xl p-12 max-w-md">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Error</h2>
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!team) return null;

  const isCreator = currentUser && team.creatorId === currentUser.uid;
  const displayTitle = team.projectName || team.postTitle;

  // --- CALCULATE STATES ---
  const isExpired = team.hackathonEndsAt && team.hackathonEndsAt.toMillis() < Date.now();
  const isHackathonActive = team.hackathonStartedAt && !team.isSubmitted && !isExpired;
  const isReadOnly = team.isSubmitted || isExpired;

  // Tab configuration with icons
  const tabs = [
    { id: 'chat', label: 'Team Chat', icon: '💬' },
    { id: 'tasks', label: 'Task Hub', icon: '✅' },
    { id: 'design', label: 'Design Hub', icon: '🛠️' },
    { id: 'docs', label: 'Knowledge Base', icon: '📚' },
    { id: 'research', label: 'AI Research', icon: '🧠' }
  ];

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      
      {/* Progress Bar at top */}
      <div className="shrink-0">
        <TaskProgressBar teamId={teamId} />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden p-4 sm:p-6">
          
        {/* --- HEADER --- */}
        <div className="mb-6 shrink-0">
          <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Left Section: Title and Timer */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1 min-w-0">
                <div className="flex-1 min-w-0">
                  <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-1">
                    Workspace
                  </p>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight truncate">
                    {displayTitle}
                  </h1>
                </div>
                
                {/* Timer Display (only if active) */}
                {isHackathonActive && team.hackathonEndsAt && (
                  <div className="shrink-0">
                    <HackathonTimer endsAt={team.hackathonEndsAt} />
                  </div>
                )}

                {/* Frozen/Submitted Badge */}
                {isReadOnly && (
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm shrink-0 ${
                    team.isSubmitted 
                      ? 'bg-green-500/10 text-green-400 border border-green-500/30' 
                      : 'bg-red-500/10 text-red-400 border border-red-500/30'
                  }`}>
                    {team.isSubmitted ? (
                      <>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>PROJECT SUBMITTED</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span>TIME EXPIRED</span>
                      </>
                    )}
                  </div>
                )}
              </div>
              
              {/* Right Section: Action Buttons */}
              <div className="flex items-center gap-3 shrink-0">
                {/* Start Button */}
                {!team.hackathonStartedAt && isCreator && (
                  <button 
                    onClick={() => setIsStartModalOpen(true)} 
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold transition-all duration-300 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 animate-pulse"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Start Hackathon</span>
                  </button>
                )}

                {/* Submit/View Button */}
                {team.isSubmitted ? (
                  <a 
                    href={team.projectLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 font-bold transition-all duration-300 border border-blue-500/30 hover:border-blue-500/50"
                  >
                    <span>View Project</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ) : (team.hackathonStartedAt && isCreator && !isExpired) ? (
                  <button 
                    onClick={handleSubmitProject} 
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-gray-900 font-bold transition-all duration-300 shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    <span>Submit Project</span>
                  </button>
                ) : null}

                <Link 
                  to={`/hackathon/${team.hackathonId}`} 
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-700/50 hover:bg-gray-700 text-gray-300 hover:text-white font-semibold transition-all duration-300 border border-gray-600 hover:border-gray-500"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>Back</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* --- MAIN LAYOUT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 flex-1 min-h-0">
          {/* Main Content Area */}
          <div className="lg:col-span-3 bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl shadow-xl overflow-hidden flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-gray-700 shrink-0 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
              {tabs.map(tab => (
                <button 
                  key={tab.id} 
                  onClick={() => setActiveTab(tab.id)} 
                  className={`relative px-4 sm:px-6 py-4 text-center font-bold transition whitespace-nowrap flex items-center gap-2 ${
                    activeTab === tab.id 
                      ? 'text-green-400 bg-gray-900/50' 
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/30'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-600"></div>
                  )}
                </button>
              ))}
            </div>
            
            {/* Tab Content */}
            <div className="flex-1 overflow-hidden bg-gray-900/50">
              {activeTab === 'chat' && <div className="h-full"><TeamChat teamId={teamId} isReadOnly={isReadOnly} /></div>}
              {activeTab === 'tasks' && <div className="h-full"><TaskHub teamId={teamId} teamMembers={teamMembers} isReadOnly={isReadOnly} /></div>}
              {activeTab === 'design' && <div className="h-full"><DesignHub teamId={teamId} isReadOnly={isReadOnly} /></div>}
              {activeTab === 'docs' && <div className="h-full"><TeamKnowledgeBase teamId={teamId} isReadOnly={isReadOnly} /></div>}
              {activeTab === 'research' && <div className="h-full"><TeamResearch teamId={teamId} isReadOnly={isReadOnly} /></div>}
            </div>
          </div>
          
          {/* Team Members Sidebar */}
          <div className="lg:col-span-1 bg-gray-800/50 backdrop-blur border border-gray-700 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[600px] lg:max-h-full">
            <div className="p-6 border-b border-gray-700 shrink-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Team Members</h2>
                  <p className="text-xs text-gray-400">
                    {teamMembers.length} / {team.maxTeamSize} members
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {teamMembers.map((member) => (
                <div 
                  key={member.id} 
                  className="group flex items-center gap-3 p-3 rounded-xl bg-gray-900/30 hover:bg-gray-900/50 transition-all duration-200 border border-transparent hover:border-gray-700"
                >
                  <div className="relative shrink-0">
                    <img 
                      src={member.photoURL || `https://api.dicebear.com/9.x/initials/svg?seed=${member.id}`} 
                      alt="" 
                      className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-2 border-gray-700 group-hover:border-purple-500/50 transition-colors" 
                    />
                    {team.creatorId === member.id && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-lg flex items-center justify-center border-2 border-gray-800">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white truncate group-hover:text-purple-400 transition-colors">
                      {member.displayName || member.email}
                    </p>
                    {team.creatorId === member.id && (
                      <span className="inline-flex items-center gap-1 text-xs text-green-400 font-bold">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Team Lead
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isStartModalOpen && <StartHackathonModal teamId={teamId} onClose={() => setIsStartModalOpen(false)} />}
      {isSubmitModalOpen && (<SubmitProjectModal teamId={teamId} teamName={displayTitle} onClose={() => setIsSubmitModalOpen(false)} />)}
    </div>
  );
}

export default TeamWorkspacePage;