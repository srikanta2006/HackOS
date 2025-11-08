import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { db } from '../firebaseConfig.js';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
// 1. Import useParams to get the userId from the URL
import { Link, useParams } from 'react-router-dom';

function ProfilePage() {
  const { currentUser } = useAuth();
  // 2. Get userId from URL if it exists (e.g., /user/123)
  const { userId } = useParams();
  
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [pastProjects, setPastProjects] = useState([]);

  // 3. Determine which profile to show
  // If userId is in URL, use that. Otherwise, use the logged-in user's ID.
  const targetUid = userId || currentUser?.uid;
  // 4. Check if we are allowed to edit (must be our own profile)
  const isOwnProfile = currentUser && targetUid === currentUser.uid;

  useEffect(() => {
    const loadData = async () => {
      if (!targetUid) return; // Nothing to load if no ID

      setLoading(true);

      // A. Load User Profile (Target User)
      const docRef = doc(db, 'users', targetUid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setDisplayName(data.displayName || '');
        setBio(data.bio || '');
        setSkills(data.skills || '');
      }

      // B. Load Past Projects (Target User)
      const postsRef = collection(db, 'lftPosts');
      const q = query(postsRef, where("teamMembers", "array-contains", targetUid));
      const querySnapshot = await getDocs(q);
      
      const projectsWithDetails = await Promise.all(querySnapshot.docs.map(async (projectDoc) => {
        const data = projectDoc.data();
        if (!data.isSubmitted) return null;

        // C. Fetch Member Details (ID + Name) for linking
        const memberPromises = data.teamMembers.map(async (memberId) => {
           const userSnap = await getDoc(doc(db, 'users', memberId));
           let name = "Unknown";
           if (userSnap.exists()) {
             name = userSnap.data().displayName || "Anonymous";
           }
           // Return an object so we can link to it
           return { id: memberId, name: name };
        });

        const members = await Promise.all(memberPromises);

        return {
          id: projectDoc.id,
          ...data,
          members: members // Now contains [{id, name}, {id, name}]
        };
      }));

      setPastProjects(projectsWithDetails.filter(p => p !== null));
      setLoading(false);
    };
    loadData();
  }, [targetUid]); // Reload if targetUid changes

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!isOwnProfile) return; // Extra safety check
    setMessage('');
    try {
      await setDoc(doc(db, 'users', currentUser.uid), {
        displayName, bio, skills, email: currentUser.email
      }, { merge: true });
      setMessage('Profile updated successfully!');
    } catch (err) {
      console.error("Error updating profile: ", err);
      setMessage('Failed to update profile.');
    }
  };

  if (loading) return <div className="p-8 text-center text-lg text-green-400">Loading profile...</div>;
  if (!targetUid) return <div className="p-8 text-center text-red-500">User not found.</div>;

  return (
    <div className="p-8 flex flex-col lg:flex-row justify-center items-start gap-8 pt-16 h-[calc(100vh-80px)] overflow-hidden">
      
      {/* --- LEFT COLUMN: Edit Form (ONLY VISIBLE IF OWNING PROFILE) --- */}
      {isOwnProfile && (
        <div className="w-full max-w-md space-y-8 overflow-y-auto max-h-full pr-2 shrink-0">
          <form onSubmit={handleProfileUpdate} className="bg-gray-800 p-6 rounded-lg shadow-xl">
            <h1 className="text-2xl font-bold mb-6 text-center text-green-400">Edit Profile</h1>
            <div className="mb-4">
              <label className="block text-gray-400 text-xs font-bold mb-2" htmlFor="displayName">Display Name</label>
              <input type="text" id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="w-full p-3 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-green-500" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-400 text-xs font-bold mb-2" htmlFor="bio">Bio</label>
              <textarea id="bio" rows="3" value={bio} onChange={(e) => setBio(e.target.value)} className="w-full p-3 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-green-500" />
            </div>
            <div className="mb-6">
              <label className="block text-gray-400 text-xs font-bold mb-2" htmlFor="skills">Skills</label>
              <input type="text" id="skills" value={skills} onChange={(e) => setSkills(e.target.value)} className="w-full p-3 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-green-500" />
            </div>
            {message && <p className="text-green-400 text-sm text-center mb-4">{message}</p>}
            <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300">Save Changes</button>
          </form>
        </div>
      )}

      {/* --- RIGHT COLUMN: Public Portfolio Preview (ALWAYS VISIBLE) --- */}
      {/* If not own profile, we center this column */}
      <div className={`w-full max-w-3xl flex flex-col max-h-full min-h-0 ${!isOwnProfile ? 'mx-auto' : ''}`}>
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 flex flex-col h-full">
          
          {/* User Header */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-800 shrink-0">
            <img src={`https://api.dicebear.com/9.x/initials/svg?seed=${targetUid}`} alt="avatar" className="w-16 h-16 rounded-full bg-gray-800" />
            <div>
              <h2 className="text-2xl font-bold text-white">{displayName || "Anonymous User"}</h2>
              <p className="text-gray-400 text-sm mt-1">{bio || "No bio yet."}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {skills.split(',').map((skill, i) => skill.trim() && (
                  <span key={i} className="px-2 py-0.5 bg-blue-900/30 text-blue-300 text-[10px] rounded-full uppercase tracking-wider">
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 shrink-0 text-gray-200">
            <span className="text-yellow-500">🏆</span> Project Portfolio
          </h3>
          
          {/* --- SCROLLABLE PORTFOLIO GRID --- */}
          <div className="flex-1 overflow-y-auto pr-2 min-h-0">
            {pastProjects.length > 0 ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                {pastProjects.map(project => (
                  <div key={project.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-green-500/50 transition group flex flex-col">
                    
                    <div className="flex justify-between items-start mb-2">
                      <div className="overflow-hidden">
                        <h4 className="font-bold text-md text-white leading-tight truncate" title={project.projectName || project.postTitle}>
                          {project.projectName || project.postTitle}
                        </h4>
                        <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider truncate block">
                          {project.hackathonName}
                        </span>
                      </div>
                      {project.projectLink && (
                        <a href={project.projectLink} target="_blank" rel="noopener noreferrer" className="text-xs px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded transition flex items-center gap-1 shrink-0 ml-2">
                          View ↗
                        </a>
                      )}
                    </div>
                    
                    <p className="text-gray-400 text-xs mb-3 line-clamp-2 leading-snug flex-1">
                      {project.finalDescription || project.ideaDescription}
                    </p>
                    
                    {/* --- TEAM MEMBERS WITH LINKS --- */}
                    <div className="flex flex-wrap gap-1 mt-auto">
                      {project.members.map((member) => (
                        <Link 
                          key={member.id} 
                          to={`/user/${member.id}`} // LINK TO THEIR PROFILE
                          className="bg-gray-900 px-1.5 py-0.5 rounded text-[10px] text-gray-400 border border-gray-800 truncate max-w-[100px] hover:text-white hover:border-gray-600 transition"
                        >
                          {member.name}
                        </Link>
                      ))}
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 bg-gray-800/30 rounded-lg border-2 border-dashed border-gray-800">
                <p className="text-gray-500 text-sm">No completed projects yet.</p>
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}

export default ProfilePage;