import { useState, useRef, useEffect } from 'react';
import { getMentorResponse } from '../services/gemini.js';
import HomeButton from './HomeButton.jsx';
import { FaPaperPlane } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

function MentorScreen({ goHome }) {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Salutare, sunt Mentor Ana. Sunt aici pentru a te ajuta să înțelegi orice aspect al materiei. Pune-mi o întrebare despre legislație sau logistică.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === '' || isLoading) return;

    const userMessage = { sender: 'user', text: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    const aiResponseText = await getMentorResponse(newMessages);
    
    setMessages(prevMessages => [...prevMessages, { sender: 'ai', text: aiResponseText }]);
    setIsLoading(false);
  };

  return (
    <div className="app-container">
      <HomeButton goHome={goHome} />
      <div className="chat-container">
        <div className="chat-header">
          <h2>Mentor Ana</h2>
          <p>Tutorele tău personal AI</p>
        </div>
        <div className="chat-messages">
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                className={`message ${msg.sender}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="message-bubble">{msg.text}</div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <motion.div 
              className="message ai"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="message-bubble typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form className="chat-input-form" onSubmit={handleSendMessage}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pune o întrebare..."
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading}>
            <FaPaperPlane />
          </button>
        </form>
      </div>
    </div>
  );
}

export default MentorScreen;