import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'; 
import { useAuth } from '../context/AuthContext';
import CreatePostModal from '../components/CreatePostModal';

function HackathonDetailPage() {
  const { id } = useParams();
  const { currentUser } = useAuth(); 
  const navigate = useNavigate();
  
  const [hackathon, setHackathon] = useState(null);
  const [lftPosts, setLftPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchLftPosts = async () => {
    try {
      const lftCollection = collection(db, 'lftPosts');
      
      // 1. We will fetch ALL posts for this hackathon
      const q = query(
        lftCollection, 
        where("hackathonId", "==", id)
      );
      
      const querySnapshot = await getDocs(q);
      const allPosts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // 2. THIS IS THE NEW LOGIC: Filter out full teams in JavaScript
      const openPosts = allPosts.filter(post => {
        const teamSize = post.teamMembers ? post.teamMembers.length : 0;
        const maxSize = post.maxTeamSize || 999; // Default to high number if not set
        return teamSize < maxSize; // Only keep posts that are NOT full
      });

      // 3. Sort the *open* posts by date
      openPosts.sort((a, b) => {
        const dateA = a.createdAt ? a.createdAt.toDate() : new Date(0);
        const dateB = b.createdAt ? b.createdAt.toDate() : new Date(0);
        return dateB - dateA;
      });
      
      setLftPosts(openPosts);
    } catch (err) {
      console.error("Error fetching LFT posts: ", err);
      setError('Failed to load team posts.');
    }
  };
  
  useEffect(() => {
    const fetchHackathonDetails = async () => {
      try {
        setLoading(true);
        setError('');
        
        const docRef = doc(db, 'hackathons', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setHackathon({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError('Hackathon not found.');
          setLoading(false);
          return;
        }
        
        await fetchLftPosts();
        
      } catch (err) {
        console.error("Error fetching details: ", err);
        setError('Failed to load hackathon details.');
      } finally {
        setLoading(false);
      }
    };

    fetchHackathonDetails();
  }, [id]);

  const handleOpenModal = () => {
    if (currentUser) {
      setIsModalOpen(true);
    } else {
      navigate('/login');
    }
  };

  const handlePostCreated = () => {
    fetchLftPosts(); 
  };

  if (loading) {
    return <div className="p-8 text-center text-lg text-green-400">Loading Hackathon...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-lg text-red-500">{error}</div>;
  }

  if (!hackathon) {
    return null;
  }

  return (
    <div className="p-8 relative">
      
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl mb-8">
        <h1 className="text-4xl font-bold text-green-400 mb-2">
          {hackathon.name}
        </h1>
        <p className="text-gray-300 text-lg mb-4">
          {hackathon.description}
        </p>
        <div className="flex gap-6 text-gray-400">
          <span><strong>Starts:</strong> {hackathon.startDate}</span>
          <span><strong>Ends:</strong> {hackathon.endDate}</span>
        </div>
      </div>

      <div className="mb-8 flex justify-between items-center">
        <h2 className="text-3xl font-bold">Find Teammates</h2>
        <button 
          onClick={handleOpenModal}
          className="px-6 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-bold transition duration-300"
        >
          + Post Your Idea
        </button>
      </div>

      <div className="space-y-6">
        {lftPosts.length > 0 ? (
          lftPosts.map(post => (
            <div key={post.id} className="bg-gray-800 p-6 rounded-lg shadow-lg flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-semibold text-green-300">{post.postTitle}</h3>
                <p className="text-gray-400 mt-1">
                  Posted by <span className="font-medium text-gray-200">{post.creatorName}</span>
                </p> 
                <p className="text-gray-400 text-sm mt-2">
                  <span className="font-medium text-gray-200">Skills:</span> {post.creatorSkills || 'Not specified'}
                </p>
              </div>
              
              <div className="text-right">
                {/* 4. Show the team count on the card */}
                <div className="text-lg font-bold text-gray-200 mb-2">
                  Team: {post.teamMembers.length} / {post.maxTeamSize}
                </div>
                <Link
                  to={`/post/${post.id}`} 
                  className="px-5 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-bold transition duration-300"
                >
                  View & Join
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center">
            <p className="text-gray-400">
              No open teams found for this event yet.
            </p> 
            <p className="mt-2 text-gray-300">
              Be the first one! Click "Post Your Idea" to build your team.
            </p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <CreatePostModal 
          hackathon={hackathon}
          onClose={() => setIsModalOpen(false)}
          onPostCreated={handlePostCreated}
        />
      )}
    </div>
  );
}

export default HackathonDetailPage;