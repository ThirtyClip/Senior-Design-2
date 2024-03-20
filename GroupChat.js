import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GroupChatWindow from './GroupChatWindow';
import MessageInput from './MessageInput';

const GroupChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    // Fetch initial messages from the server
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get('/api/group/messages');
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    try {
      await axios.post('/api/group/messages', { text: input });
      setInput('');
      fetchMessages(); // Refresh messages after sending
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div>
      <GroupChatWindow messages={messages} />
      <MessageInput
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onSend={sendMessage}
      />
    </div>
  );
};

export default GroupChatApp;
