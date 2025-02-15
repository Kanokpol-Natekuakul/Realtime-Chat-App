import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:3000');

const App = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [user] = useState({ id: 1, username: 'User1' });
  const receiverId = 2;

  useEffect(() => {
    socket.on('newMessage', newMessage => {
      setMessages(prev => [...prev, newMessage]);
    });

    return () => {
      socket.off('newMessage');
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = { sender_id: user.id, receiver_id: receiverId, message };
      socket.emit('sendMessage', newMessage);
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
    }
  };

  return (
    <div className='p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4'>
      <h1 className='text-xl font-bold'>Chat App</h1>
      <div className='border p-4 h-64 overflow-y-auto'>
        {messages.map((msg, index) => (
          <div key={index} className={msg.sender_id === user.id ? 'text-right' : 'text-left'}>
            <p className='p-2 bg-blue-200 rounded-md inline-block'>{msg.message}</p>
          </div>
        ))}
      </div>
      <input
        type='text'
        value={message}
        onChange={e => setMessage(e.target.value)}
        className='border p-2 w-full'
      />
      <button onClick={sendMessage} className='bg-blue-500 text-white p-2 w-full'>Send</button>
    </div>
  );
};

export default App;
