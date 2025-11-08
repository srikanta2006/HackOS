import React, { useEffect, useState, useRef } from 'react';
import { StreamChat } from 'stream-chat';
import { 
  Chat, 
  Channel, 
  Window, 
  ChannelHeader, 
  MessageList, 
  MessageInput, 
  Thread, 
  LoadingIndicator 
} from 'stream-chat-react';
import 'stream-chat-react/dist/css/v2/index.css';
import { useAuth } from '../context/AuthContext';

// REPLACE THIS WITH YOUR ACTUAL API KEY
const API_KEY = '9c4rdrthyz5c'; 

function TeamStreamChat({ teamId, teamName }) {
  const { currentUser } = useAuth();
  const [client, setClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [error, setError] = useState(null);
  
  // Refs to track connection state across renders
  const isConnecting = useRef(false);
  const activeUserId = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const initChat = async () => {
      if (!currentUser) return;
      if (isConnecting.current) return;
      if (activeUserId.current === currentUser.uid && client) return;

      try {
        isConnecting.current = true;
        setError(null);

        const streamClient = StreamChat.getInstance(API_KEY);

        // CRITICAL FIX: Always disconnect any stale user first
        if (streamClient.userID && streamClient.userID !== currentUser.uid) {
          console.log(`[Chat] Disconnecting stale user: ${streamClient.userID}`);
          await streamClient.disconnectUser();
        }

        // Only connect if not already connected as the correct user
        if (streamClient.userID !== currentUser.uid) {
            console.log(`[Chat] Connecting user: ${currentUser.uid}`);
            await streamClient.connectUser(
                {
                  id: currentUser.uid,
                  name: currentUser.displayName || currentUser.email,
                  image: currentUser.photoURL,
                  role: 'admin' // Bypass permission issues for dev
                },
                streamClient.devToken(currentUser.uid)
            );
        }

        if (!isMounted) return;

        // We use 'messaging' here as it's the most common
        const newChannel = streamClient.channel('messaging', teamId, {
          name: teamName || 'Team Chat',
          members: [currentUser.uid],
        });

        await newChannel.watch();

        if (isMounted) {
          console.log("[Chat] Connected successfully");
          setClient(streamClient);
          setChannel(newChannel);
          activeUserId.current = currentUser.uid;
        }

      } catch (err) {
        console.error("[Chat Error]", err);
        if (isMounted) {
           setError(`Connection failed: ${err.message}`);
        }
      } finally {
        if (isMounted) {
            isConnecting.current = false;
        }
      }
    };

    initChat();

    return () => { 
      isMounted = false; 
      // Clean up connection logic when user logs out
      if (client && !currentUser) {
          client.disconnectUser();
          setClient(null);
          setChannel(null);
          activeUserId.current = null;
      }
    };
  }, [currentUser, teamId, teamName, client]);

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-gray-900 p-6 text-center">
        <p className="text-red-400 mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-gray-800 text-white rounded">
          Reload Chat
        </button>
      </div>
    );
  }

  if (!client || !channel) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-900">
        <LoadingIndicator size={40} />
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-900 stream-chat-dark-theme"> 
      <Chat client={client} theme="str-chat__theme-dark">
        <Channel channel={channel}>
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput focus />
          </Window>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
}

export default TeamStreamChat;