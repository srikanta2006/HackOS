import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import HackathonCard from '../components/HackathonCard';
import AddHackathonModal from '../components/AddHackathonModal'; // 1. Import new modal
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function HackathonsPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // 2. Modal state

  const fetchHackathons = async () => {
    try {
      setLoading(true);
      setError('');
      const hackathonsCollection = collection(db, 'hackathons');
      // Order by newest created first so new ones show up at top
      const q = query(hackathonsCollection, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const hackathonsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setHackathons(hackathonsList);
    } catch (err) {
      console.error("Error fetching hackathons: ", err);
      // Fallback if 'createdAt' index is missing initially
      if (err.message.includes("requires an index")) {
         const simpleQuery = query(collection(db, 'hackathons'));
         const simpleSnap = await getDocs(simpleQuery);
         const simpleList = simpleSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
         setHackathons(simpleList);
      } else {
         setError('Failed to load hackathons.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHackathons();
  }, []);

  const handleAddClick = () => {
    if (currentUser) {
      setIsModalOpen(true);
    } else {
      navigate('/login');
    }
  }

  return (
    <div className="p-8">
      {/* 3. Updated Header with Button */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Explore Hackathons</h1>
        <button 
          onClick={handleAddClick}
          className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition shadow-lg flex items-center gap-2"
        >
          <span className="text-2xl leading-none">+</span> Add Hackathon
        </button>
      </div>
      
      {loading && <p className="text-center text-lg text-green-400">Loading events...</p>}
      {error && <p className="text-center text-lg text-red-500">{error}</p>}
      
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hackathons.length > 0 ? (
            hackathons.map(hackathon => (
              <HackathonCard key={hackathon.id} hackathon={hackathon} />
            ))
          ) : (
            <div className="col-span-3 text-center py-12 bg-gray-800 rounded-xl">
              <p className="text-xl text-gray-300 mb-4">No hackathons found.</p>
              <p className="text-gray-400">Be the first to add one!</p>
            </div>
          )}
        </div>
      )}

      {/* 4. Render Modal */}
      {isModalOpen && (
        <AddHackathonModal 
          onClose={() => setIsModalOpen(false)}
          onHackathonAdded={() => {
             fetchHackathons(); // Refresh list after adding
          }}
        />
      )}
    </div>
  );
}

export default HackathonsPage;