import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig.js';
import { collection, onSnapshot, query } from 'firebase/firestore';

function TaskProgressBar({ teamId }) {
  const [percentage, setPercentage] = useState(0);
  const [taskStats, setTaskStats] = useState({ total: 0, done: 0 });
  const [statusColor, setStatusColor] = useState('bg-blue-600');

  useEffect(() => {
    const tasksRef = collection(db, 'lftPosts', teamId, 'tasks');
    // Listen to ALL tasks in real-time
    const q = query(tasksRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasks = snapshot.docs.map(doc => doc.data());
      const total = tasks.length;
      // Count how many are in the 'done' column
      const done = tasks.filter(t => t.status === 'done').length;

      setTaskStats({ total, done });

      if (total === 0) {
        setPercentage(0);
      } else {
        const percent = (done / total) * 100;
        setPercentage(percent);

        // Change color based on progress
        if (percent === 100) setStatusColor('bg-green-500'); // All done!
        else if (percent > 66) setStatusColor('bg-blue-500'); // Making good progress
        else if (percent > 33) setStatusColor('bg-yellow-500'); // Getting started
        else setStatusColor('bg-red-500'); // Just started
      }
    });

    return () => unsubscribe();
  }, [teamId]);

  return (
    <div className="w-full bg-gray-900 h-7 relative overflow-hidden shadow-inner border-b border-black/50">
        {/* The actual progress bar with smooth transition */}
        <div 
            className={`h-full transition-all duration-700 ease-in-out ${statusColor}`}
            style={{ width: `${percentage}%` }}
        />
        
        {/* Text overlay */}
        <div className="absolute inset-0 flex items-center justify-between px-4 text-xs font-bold text-white uppercase tracking-wider mix-blend-difference">
            <span className="flex items-center gap-2">
              🚀 Project Completion
            </span>
            <span>
              {taskStats.done} / {taskStats.total} Tasks ({percentage.toFixed(0)}%)
            </span>
        </div>
    </div>
  );
}

export default TaskProgressBar;