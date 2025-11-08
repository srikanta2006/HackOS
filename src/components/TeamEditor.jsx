import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import professional styles
import { db } from '../firebaseConfig';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

function TeamEditor({ teamId }) {
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('Loading...');
  
  // Refs to help manage real-time syncing without loops
  const isLocalChange = useRef(false);
  const timeoutRef = useRef(null);

  // 1. Configure the Toolbar (just like Google Docs)
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link', 'code-block'],
      ['clean']
    ],
  };

  // 2. Real-time listener (Read from Firebase)
  useEffect(() => {
    const docRef = doc(db, 'lftPosts', teamId, 'wiki', 'primary');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (!isLocalChange.current) { // Only update if WE aren't actively typing
        if (docSnap.exists()) {
          setContent(docSnap.data().content || '');
          setStatus('Saved');
        } else {
          setStatus('Ready to write...');
        }
      }
    });
    return () => unsubscribe();
  }, [teamId]);

  // 3. Handle local edits (Write to Firebase)
  const handleChange = (html, delta, source) => {
    if (source === 'user') {
      isLocalChange.current = true;
      setContent(html);
      setStatus('Typing...');

      // Debounce the save (wait 1s after last keystroke to save)
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(async () => {
        setStatus('Saving...');
        await setDoc(doc(db, 'lftPosts', teamId, 'wiki', 'primary'), { content: html }, { merge: true });
        setStatus('Saved');
        isLocalChange.current = false;
      }, 1000);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg overflow-hidden">
      {/* Status Bar */}
      <div className="bg-gray-100 p-2 text-xs text-right text-gray-500 border-b border-gray-300">
        {status}
      </div>
      
      {/* The Quill Editor */}
      <ReactQuill 
        theme="snow"
        value={content}
        onChange={handleChange}
        modules={modules}
        className="h-full flex-1"
        style={{ height: 'calc(100% - 40px)' }} // Adjust for status bar
      />
    </div>
  );
}

export default TeamEditor;