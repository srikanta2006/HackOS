import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebaseConfig';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, where, doc, updateDoc, arrayUnion, arrayRemove, increment } from 'firebase/firestore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// NEW PROP: isReadOnly
function TeamChat({ teamId, isReadOnly }) {
  const { currentUser } = useAuth();
  const [mainMessages, setMainMessages] = useState([]);
  const [threadMessages, setThreadMessages] = useState([]);
  const [activeThread, setActiveThread] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [newThreadMessage, setNewThreadMessage] = useState('');
  const mainScroll = useRef();
  const threadScroll = useRef();

  const sortMessages = (msgs) => {
    return msgs.sort((a, b) => {
      const timeA = a.createdAt?.toMillis() || Date.now();
      const timeB = b.createdAt?.toMillis() || Date.now();
      return timeA - timeB;
    });
  };

  useEffect(() => {
    const messagesRef = collection(db, 'lftPosts', teamId, 'messages');
    const q = query(messagesRef, where('parentId', '==', null));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMainMessages(sortMessages(msgs));
      setTimeout(() => mainScroll.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });
    return () => unsubscribe();
  }, [teamId]);

  useEffect(() => {
    if (!activeThread) return;
    const messagesRef = collection(db, 'lftPosts', teamId, 'messages');
    const q = query(messagesRef, where('parentId', '==', activeThread.id));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setThreadMessages(sortMessages(msgs));
      setTimeout(() => threadScroll.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });
    return () => unsubscribe();
  }, [teamId, activeThread]);

  const handleSendMessage = async (text, parentId = null) => {
    if (!text.trim() || isReadOnly) return; // BLOCK SENDING IF READ ONLY
    const messagesRef = collection(db, 'lftPosts', teamId, 'messages');
    await addDoc(messagesRef, {
      text: text, createdAt: serverTimestamp(), uid: currentUser.uid,
      displayName: currentUser.displayName || currentUser.email, photoURL: currentUser.photoURL, parentId: parentId, replyCount: 0
    });
    if (parentId) {
      const parentRef = doc(db, 'lftPosts', teamId, 'messages', parentId);
      await updateDoc(parentRef, { replyCount: increment(1) });
      setNewThreadMessage('');
    } else {
      setNewMessage('');
    }
  };

  // ... (rest of your helper functions like formatTime can stay same, just re-pasting whole file for safety)

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const MessageBubble = ({ msg, isThreadView = false }) => {
    const isMe = msg.uid === currentUser.uid;
    return (
      <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group relative mb-4`}>
        <div className={`flex max-w-[90%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
          {!isMe && <img src={msg.photoURL || `https://api.dicebear.com/9.x/initials/svg?seed=${msg.uid}`} alt="avatar" className="w-8 h-8 rounded-full mx-2 self-start mt-1" />}
          <div>
            <div className={`text-[10px] text-gray-500 mb-1 flex gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
              <span className={!isMe ? 'text-green-300' : ''}>{isMe ? 'You' : msg.displayName}</span>
              <span className="opacity-75">{formatTime(msg.createdAt)}</span>
            </div>
            <div className={`px-3 py-2 rounded-2xl shadow-md overflow-hidden ${isMe ? 'bg-green-600 text-white rounded-tr-none' : 'bg-gray-700 text-gray-100 rounded-tl-none'}`}>
              <div className="markdown prose prose-invert max-w-none prose-sm leading-snug">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
              </div>
            </div>
            {!isThreadView && msg.replyCount > 0 && (
              <div className={`flex mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                <button onClick={() => setActiveThread(msg)} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium">
                  {msg.replyCount} {msg.replyCount === 1 ? 'reply' : 'replies'}
                </button>
              </div>
            )}
          </div>
        </div>
        {/* Hover Reply Button - HIDDEN IF READ ONLY */}
        {!isThreadView && !isReadOnly && (
           <div className={`absolute -top-6 ${isMe ? 'right-0' : 'left-12'} opacity-0 group-hover:opacity-100 transition-opacity`}>
             <button onClick={() => setActiveThread(msg)} className="bg-gray-800 hover:bg-gray-700 py-1 px-3 rounded-full shadow-lg border border-gray-700 text-xs text-blue-400 font-medium">Reply</button>
           </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-full overflow-hidden">
      <div className={`flex flex-col h-full bg-gray-900 transition-all duration-300 ${activeThread ? 'w-2/3 border-r border-gray-800' : 'w-full'}`}>
        <div className="bg-gray-800 p-3 border-b border-gray-700 shrink-0 shadow-sm z-10 flex justify-between">
          <h3 className="font-semibold text-green-400">💬 Team Chat {isReadOnly && <span className="text-red-500 ml-2">(FROZEN)</span>}</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 bg-gray-900">
          {mainMessages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}
          <div ref={mainScroll} />
        </div>
        
        {/* DISABLED INPUT IF READ ONLY */}
        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(newMessage); }} className="bg-gray-800 p-3 border-t border-gray-700 flex gap-2 shrink-0">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={isReadOnly ? "Chat is frozen." : "Message team..."}
            disabled={isReadOnly}
            className="flex-1 p-3 rounded-xl bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button type="submit" disabled={isReadOnly || !newMessage.trim()} className="px-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed">Send</button>
        </form>
      </div>

      {activeThread && (
        <div className="w-1/3 flex flex-col h-full bg-gray-850 border-l border-black/20 shadow-2xl z-20">
          <div className="bg-gray-850 p-3 border-b border-gray-700 flex justify-between items-center shrink-0">
            <h3 className="font-semibold text-white">Thread</h3>
            <button onClick={() => setActiveThread(null)} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 bg-gray-900/50 space-y-6">
            <div className="opacity-75 border-b border-gray-700 pb-4 mb-4">
               <MessageBubble msg={activeThread} isThreadView={true} />
            </div>
            {threadMessages.map(msg => <MessageBubble key={msg.id} msg={msg} isThreadView={true} />)}
            <div ref={threadScroll} />
          </div>
          {/* DISABLED THREAD INPUT IF READ ONLY */}
          <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(newThreadMessage, activeThread.id); }} className="p-3 border-t border-gray-700 flex gap-2 shrink-0 bg-gray-800">
             <input type="text" value={newThreadMessage} onChange={(e) => setNewThreadMessage(e.target.value)} placeholder={isReadOnly ? "Thread frozen." : "Reply to thread..."} disabled={isReadOnly} className="flex-1 p-2 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-blue-500 text-sm disabled:opacity-50" />
            <button type="submit" disabled={isReadOnly || !newThreadMessage.trim()} className="px-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg text-sm disabled:bg-gray-700">Reply</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default TeamChat;