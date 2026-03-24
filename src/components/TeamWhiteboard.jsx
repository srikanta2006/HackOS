import React, { useState, useEffect, useRef } from 'react';
import { Excalidraw } from "@excalidraw/excalidraw";
import { db } from '../firebaseConfig';
import { doc, onSnapshot, setDoc, collection, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

function TeamWhiteboard({ teamId }) {

  const { currentUser } = useAuth();

  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const [status, setStatus] = useState('Loading...');
  const [cursors, setCursors] = useState({});

  const timeoutRef = useRef(null);
  const isSyncingFromFirebase = useRef(false);
  const lastSavedData = useRef(null);

  /* =====================================================
     1️⃣ REAL-TIME WHITEBOARD SYNC
  ====================================================== */

  useEffect(() => {
    if (!excalidrawAPI || !teamId) return;

    if (!db) {
      setStatus("Offline Mode");
      return;
    }

    const docRef = doc(db, 'lftPosts', teamId, 'wiki', 'whiteboard');

    const unsubscribe = onSnapshot(docRef, (docSnap) => {

      if (!docSnap.exists()) {
        setStatus("Ready");
        return;
      }

      const data = docSnap.data();
      if (!data?.elements) return;

      const parsedElements = JSON.parse(data.elements);

      if (JSON.stringify(parsedElements) === lastSavedData.current) {
        return;
      }

      isSyncingFromFirebase.current = true;

      excalidrawAPI.updateScene({
        elements: parsedElements,
        appState: data.appState ? JSON.parse(data.appState) : undefined
      });

      lastSavedData.current = JSON.stringify(parsedElements);
      setStatus('Synced');

      setTimeout(() => {
        isSyncingFromFirebase.current = false;
      }, 500);

    }, (err) => {
      console.error("Whiteboard sync error:", err);
      setStatus("Offline Mode");
    });

    return () => unsubscribe();

  }, [teamId, excalidrawAPI]);


  /* =====================================================
     2️⃣ AUTO-SAVE (DEBOUNCED + OPTIMIZED)
  ====================================================== */

  const handleChange = (elements, appState) => {

    if (isSyncingFromFirebase.current) return;

    const stringified = JSON.stringify(elements);

    if (stringified === lastSavedData.current) return;

    if (!db) {
      localStorage.setItem(`whiteboard-${teamId}`, stringified);
      setStatus("Local Saved");
      return;
    }

    setStatus('Unsaved changes...');

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {

      setStatus('Saving...');

      try {
        const docRef = doc(db, 'lftPosts', teamId, 'wiki', 'whiteboard');

        await setDoc(docRef, {
          elements: stringified,
          appState: JSON.stringify({
            viewBackgroundColor: appState.viewBackgroundColor
          }),
          updatedAt: Date.now()
        }, { merge: true });

        lastSavedData.current = stringified;
        setStatus('Saved');

      } catch (err) {
        console.error("Whiteboard save failed:", err);
        setStatus('Error saving');
      }

    }, 1000);
  };


  /* =====================================================
     3️⃣ LIVE MULTI-USER CURSOR TRACKING
  ====================================================== */

  // Send my cursor position
  useEffect(() => {
    if (!currentUser || !db || !teamId) return;

    const presenceRef = doc(db, "lftPosts", teamId, "presence", currentUser.uid);

    let throttle;

    const handleMouseMove = (e) => {

      if (throttle) return;

      throttle = setTimeout(() => {
        throttle = null;
      }, 100);

      setDoc(presenceRef, {
        x: e.clientX,
        y: e.clientY,
        displayName: currentUser.displayName || "User",
        updatedAt: Date.now()
      }).catch(err => {
        console.error("Cursor update failed:", err);
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      deleteDoc(presenceRef).catch(() => { });
    };

  }, [currentUser, teamId]);


  // Listen to all cursors
  useEffect(() => {
    if (!db || !teamId) return;

    const presenceCol = collection(db, "lftPosts", teamId, "presence");

    const unsubscribe = onSnapshot(presenceCol, (snapshot) => {

      const updated = {};

      snapshot.forEach(doc => {
        updated[doc.id] = doc.data();
      });

      setCursors(updated);

    });

    return () => unsubscribe();

  }, [teamId]);


  /* =====================================================
     4️⃣ UI
  ====================================================== */

  return (
    <div className="h-full w-full bg-gray-900 flex flex-col">

      <div className="bg-gray-800 p-2 border-b border-gray-700 flex justify-between items-center text-sm">
        <span className="text-green-400 font-semibold ml-4">
          Framework Design Space (Excalidraw)
        </span>

        <span className={`mr-4 ${status === 'Saved' || status === 'Synced'
            ? 'text-gray-400'
            : status.includes("Error")
              ? 'text-red-400'
              : 'text-yellow-400'
          }`}>
          {status}
        </span>
      </div>

      <div className="flex-1 relative">
        <Excalidraw
          excalidrawAPI={(api) => setExcalidrawAPI(api)}
          onChange={handleChange}
          theme="dark"
          UIOptions={{
            canvasActions: { loadScene: false, saveToActiveFile: false }
          }}
        />

        {/* Live Cursors Overlay */}
        {Object.entries(cursors).map(([uid, cursor]) => {
          if (uid === currentUser?.uid) return null;

          return (
            <div
              key={uid}
              style={{
                position: "fixed",
                left: cursor.x,
                top: cursor.y,
                pointerEvents: "none",
                transform: "translate(-50%, -50%)",
                zIndex: 9999
              }}
            >
              <div style={{
                background: "#06b6d4",
                padding: "4px 8px",
                borderRadius: "6px",
                fontSize: "10px",
                color: "black",
                fontWeight: "bold"
              }}>
                {cursor.displayName}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TeamWhiteboard;