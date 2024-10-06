"use client";
import React, { useState, useEffect } from 'react';
import { useVoice, VoiceReadyState } from "@humeai/voice-react";
import { Mic, MicOff, Send } from 'lucide-react';
// import { JSONMessage as HumeJSONMessage } from '@humeai/voice-react';
import ARScene from './ARScene.jsx';
export default function Controls() {
  const { connect, disconnect, readyState, messages } = useVoice();
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { text: 'Welcome to MendPath. How can I assist you today?', sender: 'bot' },
  ]);
  const [, setHasAudioPermission] = useState(false);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);

  // Add this useEffect hook to handle incoming messages
  React.useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.type === 'user_message' || lastMessage.type === 'assistant_message') {
        const content = lastMessage.message.content;
        if (content) {
          setChatHistory(prev => [...prev, { text: content, sender: lastMessage.type === 'user_message' ? 'user' : 'bot' }]);
        }
      }
    }
  }, [messages]);

  useEffect(() => {
    checkAudioPermission();
  }, []);

  const checkAudioPermission = async () => {
    if (typeof navigator.permissions !== 'undefined') {
      try {
        const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        setHasAudioPermission(permissionStatus.state === 'granted');
        return permissionStatus.state === 'granted';
      } catch (err) {
        console.error('Error checking audio permission:', err);
      }
    }
    return false;
  };

  const requestAudioPermission = async () => {
    setIsRequestingPermission(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setHasAudioPermission(true);
      return true;
    } catch (err) {
      console.error('Error requesting audio permission:', err);
      setHasAudioPermission(false);
      return false;
    } finally {
      setIsRequestingPermission(false);
    }
  };

  const handleConnect = async () => {
    const hasPermission = await checkAudioPermission();
    
    if (!hasPermission) {
      const granted = await requestAudioPermission();
      if (!granted) {
        setChatHistory(prev => [...prev, { text: 'Please grant audio permission to use voice features.', sender: 'system' }]);
        return;
      }
    }
    
    connect()
      .then(() => {
        setChatHistory(prev => [...prev, { text: 'Voice session started.', sender: 'system' }]);
      })
      .catch(() => {
        setChatHistory(prev => [...prev, { text: 'Failed to start voice session.', sender: 'system' }]);
      });
  };

  const handleDisconnect = () => {
    disconnect();
    setChatHistory(prev => [...prev, { text: 'Voice session ended.', sender: 'system' }]);
  };

  const sendMessage = () => {
    if (message.trim()) {
      setChatHistory(prev => [...prev, { text: message, sender: 'user' }]);
      setMessage('');
      // Here you would typically send the message to your backend
      // and then add the response to the chat history
    }
  };
  const [showing3D, setShowing3D] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-[#e0d4c8] text-black">
      <header className="flex justify-between items-center p-4 border-b border-gray-600">
        <h1 className="text-xl font-bold">MendPath</h1>
        <button onClick={()=>{
          setShowing3D(true);
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" fill="#000000">
            <path d="M440-181 240-296q-19-11-29.5-29T200-365v-230q0-22 10.5-40t29.5-29l200-115q19-11 40-11t40 11l200 115q19 11 29.5 29t10.5 40v230q0 22-10.5 40T720-296L520-181q-19 11-40 11t-40-11Zm0-92v-184l-160-93v185l160 92Zm80 0 160-92v-185l-160 93v184ZM80-680v-120q0-33 23.5-56.5T160-880h120v80H160v120H80ZM280-80H160q-33 0-56.5-23.5T80-160v-120h80v120h120v80Zm400 0v-80h120v-120h80v120q0 33-23.5 56.5T800-80H680Zm120-600v-120H680v-80h120q33 0 56.5 23.5T880-800v120h-80ZM480-526l158-93-158-91-158 91 158 93Zm0 45Zm0-45Zm40 69Zm-80 0Z" />
          </svg>
        </button>
      </header>

      <div className="flex-1 overflow-auto p-4">
        <div className="bg-blue-900 bg-opacity-10 p-4 mb-4 rounded-lg text-center">
          <p>Crisis Hotline: 998</p>
          <p>Emergency: 911</p>
        </div>
        {chatHistory.map((chat, index) => (
          <div key={index} className={`mb-4 ${chat.sender === 'user' ? 'flex justify-end' : 'flex justify-start'}`}>
            <span className={`inline-block p-3 rounded-lg max-w-[70%] ${
              chat.sender === 'user' ? 'bg-[#e3beb3]' : 'bg-white border border-gray-600'
            }`}>
              {chat.text}
            </span>
          </div>
        ))}
      </div>
      {showing3D && <ARScene />}
      <div className="p-4 border-t border-gray-600 bg-[#FFFFFF]">
        <div className="flex items-center">
          <button
            onClick={readyState === VoiceReadyState.OPEN ? handleDisconnect : handleConnect}
            className="p-2 rounded-full bg-[#5e4d43] mr-2"
            disabled={isRequestingPermission}
          >
            {isRequestingPermission ? (
              'Requesting...'
            ) : readyState === VoiceReadyState.OPEN ? (
              <MicOff size={24} />
            ) : (
              <Mic size={24} />
            )}
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 rounded-full border border-gray-600 text-black"
          />
          <button onClick={sendMessage} className="p-2 rounded-full bg-[#5e4d43] ml-2">
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
