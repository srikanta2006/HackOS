import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebaseConfig';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  deleteDoc,
  doc,
  getDoc // Added getDoc to fetch config
} from 'firebase/firestore';
import ReactMarkdown from 'react-markdown';

function TeamResearch({ teamId }) {
  const { currentUser } = useAuth();
  const [queryInput, setQueryInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [savedInsights, setSavedInsights] = useState([]);

  useEffect(() => {
    const researchRef = collection(db, 'lftPosts', teamId, 'research');
    const q = query(researchRef, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSavedInsights(results);
    });
    return () => unsubscribe();
  }, [teamId]);

  const performAIResearch = async (userQuery) => {
    setIsSearching(true);
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;

    if (!apiKey) {
        alert("Missing Groq API Key!");
        setIsSearching(false);
        return;
    }

    try {
      // 1. FETCH THE LATEST MODEL NAME FROM FIREBASE
      // This makes your app "future-proof" without re-deploying
      const configRef = doc(db, 'app_config', 'ai_settings');
      const configSnap = await getDoc(configRef);
      
      // Default fallback if Firebase fails
      let modelName = "llama-3.3-70b-versatile";
      
      if (configSnap.exists() && configSnap.data().current_model) {
        modelName = configSnap.data().current_model;
        console.log("Using dynamic model from Firebase:", modelName);
      }

      // 2. CALL GROQ WITH THAT DYNAMIC MODEL NAME
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: modelName, // <-- USING THE VARIABLE HERE
          messages: [
            {
              role: "system",
              content: "You are an expert technical research assistant for a hackathon team. Provide concise, accurate, and well-structured answers with code examples where relevant."
            },
            {
              role: "user",
              content: userQuery
            }
          ],
          temperature: 0.5,
          max_tokens: 1024
        })
      });

      const data = await response.json();

      if (data.error) {
          throw new Error(data.error.message);
      }

      const aiAnswer = data.choices[0].message.content;
      setCurrentResult({ question: userQuery, answer: aiAnswer });
      
    } catch (err) {
      console.error("Groq Error:", err);
      alert(`Research Failed: ${err.message}`);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!queryInput.trim()) return;
    performAIResearch(queryInput);
  };

  const handleSaveInsight = async () => {
    if (!currentResult) return;
    try {
      await addDoc(collection(db, 'lftPosts', teamId, 'research'), {
        question: currentResult.question,
        answer: currentResult.answer,
        savedBy: currentUser.displayName || currentUser.email,
        createdAt: serverTimestamp()
      });
      setCurrentResult(null);
      setQueryInput('');
    } catch (err) {
      console.error("Error saving insight:", err);
      alert("Failed to save to team notes.");
    }
  };

  const handleDeleteInsight = async (insightId) => {
    if (window.confirm("Delete this saved insight?")) {
       await deleteDoc(doc(db, 'lftPosts', teamId, 'research', insightId));
    }
  }

  return (
    <div className="h-full flex bg-gray-900">
      <div className="w-1/3 border-r border-gray-700 flex flex-col bg-gray-800">
        <div className="p-3 border-b border-gray-700 font-semibold text-green-400 flex items-center gap-2 shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
          </svg>
          Saved Team Insights ({savedInsights.length})
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {savedInsights.length === 0 ? (
            <p className="text-gray-500 text-sm text-center mt-10">No research saved yet.</p>
          ) : (
            savedInsights.map(insight => (
              <div key={insight.id} className="bg-gray-700 p-4 rounded-lg shadow relative group">
                <button onClick={() => handleDeleteInsight(insight.id)} className="absolute top-2 right-2 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                <h4 className="font-bold text-white mb-2">{insight.question}</h4>
                <div className="text-gray-300 text-sm prose prose-invert max-w-none max-h-40 overflow-y-auto">
                  <ReactMarkdown>{insight.answer}</ReactMarkdown>
                </div>
                <div className="mt-3 text-xs text-gray-500">Saved by {insight.savedBy}</div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="w-2/3 flex flex-col">
        <div className="flex-1 p-6 overflow-y-auto">
          {!currentResult && !isSearching && (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mb-4 text-orange-500 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <p className="text-xl">Ask Groq to research incredibly fast...</p>
            </div>
          )}
          {isSearching && (
            <div className="h-full flex items-center justify-center">
              <div className="animate-pulse text-orange-500 text-xl flex items-center gap-3 font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Groq is thinking...
              </div>
            </div>
          )}
          {currentResult && !isSearching && (
            <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-4">{currentResult.question}</h2>
              <div className="prose prose-invert max-w-none text-gray-200">
                <ReactMarkdown>{currentResult.answer}</ReactMarkdown>
              </div>
              <div className="mt-8 flex justify-end gap-4 border-t border-gray-700 pt-4">
                <button onClick={() => setCurrentResult(null)} className="px-4 py-2 text-gray-400 hover:text-white transition">Discard</button>
                <button onClick={handleSaveInsight} className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg flex items-center gap-2 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                  </svg>
                  Save to Team Insights
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="p-4 bg-gray-800 border-t border-gray-700 shrink-0">
          <form onSubmit={handleSubmit} className="flex gap-4">
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder="e.g., Compare React Context vs Redux for this hackathon"
              className="flex-1 p-4 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-orange-500 text-lg"
              disabled={isSearching}
            />
            <button type="submit" disabled={isSearching || !queryInput.trim()} className="px-8 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg transition disabled:bg-gray-600">
              Groq It!
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TeamResearch;