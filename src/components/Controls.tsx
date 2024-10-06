"use client";
import React, { useState, useEffect } from 'react';
import { useVoice, VoiceReadyState } from "@humeai/voice-react";
import { Mic, MicOff, Send } from 'lucide-react';

export default function Controls() {
  const { connect, disconnect, readyState, messages } = useVoice();
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { text: 'Welcome to MendPath. How can I assist you today?', sender: 'bot' },
  ]);
  const [hasAudioPermission, setHasAudioPermission] = useState(false);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);

  // Add this useEffect hook to handle incoming messages
  React.useEffect(() => {
    if (messages.length > 0) {
      const lastMessage: any= messages[messages.length - 1];
      console.log(lastMessage as any);
      if (lastMessage.message && 'content' in lastMessage.message) {
        if (lastMessage.type === 'user_message') {
          setChatHistory(prev => [...prev, { text: lastMessage.message.content, sender: 'user' }]);
        }
        else{
          setChatHistory(prev => [...prev, { text: lastMessage.message.content, sender: 'bot' }]);
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

  return (
    <div className="flex flex-col h-screen bg-[#001F3F] text-white">
      <header className="flex justify-between items-center p-4 border-b border-gray-600">
        <h1 className="text-xl font-bold">MendPath</h1>
      </header>

      <div className="flex-1 overflow-auto p-4">
        <div className="bg-blue-900 bg-opacity-10 p-4 mb-4 rounded-lg text-center">
          <p>Hotline: 9999999</p>
          <p>Emergency: 911</p>
        </div>
        {chatHistory.map((chat, index) => (
          <div key={index} className={`mb-4 ${chat.sender === 'user' ? 'flex justify-end' : 'flex justify-start'}`}>
            <span className={`inline-block p-3 rounded-lg max-w-[70%] ${
              chat.sender === 'user' ? 'bg-green-500' : 'bg-[#002a54] border border-gray-600'
            }`}>
              {chat.text}
            </span>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-600 bg-[#002a54]">
        <div className="flex items-center">
          <button
            onClick={readyState === VoiceReadyState.OPEN ? handleDisconnect : handleConnect}
            className="p-2 rounded-full bg-blue-500 mr-2"
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
            className="flex-1 p-2 rounded-full bg-[#001F3F] border border-gray-600 text-white"
          />
          <button onClick={sendMessage} className="p-2 rounded-full bg-green-500 ml-2">
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
