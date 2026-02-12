import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Chatbot = ({ isOpen, onClose, onOpen }) => {
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your portfolio AI assistant. Ask me about my projects, skills, or experience!", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { text: input, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/chat`, { message: input });
      setMessages(prev => [...prev, { text: response.data.reply, isBot: true }]);
    } catch (error) {
      setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting. Please try again.", isBot: true }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <OpenButton onClick={onOpen} aria-label="Open chat">
        <span className="chat-fab-icon" aria-hidden>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            <path d="M12 8v4M10 10h4" strokeWidth="2.2"/>
          </svg>
          <span className="chat-fab-sparkle chat-fab-sparkle--1">✦</span>
          <span className="chat-fab-sparkle chat-fab-sparkle--2">✦</span>
        </span>
        <span className="label">Ask AI</span>
      </OpenButton>
    );
  }

  return (
    <ChatContainer className="chat-window">
      <ChatHeader>
        <div className="chat-header-content">
          <span className="chat-header-icon" aria-hidden>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a4 4 0 0 0-4 4v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4z"/><path d="M12 12v4M10 14h4"/></svg>
          </span>
          <div>
            <h3>Portfolio Assistant</h3>
            <p>Ask me about my work!</p>
          </div>
        </div>
        <CloseButton onClick={onClose} aria-label="Close chat">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </CloseButton>
      </ChatHeader>
      <MessagesContainer>
        {messages.map((msg, idx) => (
          <Message key={idx} isBot={msg.isBot}>{msg.text}</Message>
        ))}
        {loading && <Message isBot>Thinking...</Message>}
      </MessagesContainer>
      <InputContainer>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask about my projects..."
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={loading}>{loading ? '...' : 'Send'}</button>
      </InputContainer>
    </ChatContainer>
  );
};

const OpenButton = styled.button`
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 1px solid rgba(232, 180, 188, 0.4);
  background: rgba(45, 34, 36, 0.75);
  backdrop-filter: blur(16px);
  color: #e8b4bc;
  cursor: pointer;
  box-shadow: 0 4px 24px rgba(0,0,0,0.25), 0 0 40px rgba(232, 180, 188, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 2px;
  z-index: 1000;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  .label { font-size: 10px; font-weight: 600; letter-spacing: 0.02em; color: #fdf8f6; }
  .chat-fab-icon {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .chat-fab-icon svg { flex-shrink: 0; stroke: #e8b4bc; }
  .chat-fab-sparkle {
    position: absolute;
    font-size: 8px;
    color: #e8b4bc;
    opacity: 0.9;
  }
  .chat-fab-sparkle--1 { top: -2px; right: -4px; }
  .chat-fab-sparkle--2 { bottom: -2px; left: -4px; }
  &:hover {
    transform: scale(1.08);
    box-shadow: 0 8px 32px rgba(0,0,0,0.3), 0 0 50px rgba(232, 180, 188, 0.2);
    border-color: rgba(232, 180, 188, 0.6);
  }
`;

const CloseButton = styled.button`
  background: rgba(232, 180, 188, 0.2);
  border: 1px solid rgba(232, 180, 188, 0.3);
  color: #fdf8f6;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, border-color 0.2s;
  &:hover {
    background: rgba(232, 180, 188, 0.35);
    border-color: rgba(232, 180, 188, 0.5);
  }
`;

const ChatContainer = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 380px;
  max-width: calc(100vw - 48px);
  height: 520px;
  border-radius: 20px;
  border: 1px solid rgba(232, 180, 188, 0.25);
  box-shadow: 0 16px 48px rgba(0,0,0,0.35), 0 0 60px rgba(232, 180, 188, 0.08);
  display: flex;
  flex-direction: column;
  background: rgba(45, 34, 36, 0.88);
  backdrop-filter: blur(20px);
  font-family: 'Segoe UI', system-ui, sans-serif;
  z-index: 1000;
  overflow: hidden;
  animation: chatSlideIn 0.35s ease;
  @keyframes chatSlideIn {
    from { opacity: 0; transform: translateY(20px) scale(0.96); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
`;

const ChatHeader = styled.div`
  background: rgba(232, 180, 188, 0.15);
  border-bottom: 1px solid rgba(232, 180, 188, 0.25);
  color: #fdf8f6;
  padding: 16px 20px;
  border-radius: 20px 20px 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .chat-header-content {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .chat-header-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: #e8b4bc;
  }
  .chat-header-icon svg { display: block; stroke: #e8b4bc; }
  h3 { margin: 0 0 4px 0; font-size: 1.1rem; color: #fdf8f6; }
  p { margin: 0; opacity: 0.85; font-size: 13px; color: rgba(253, 248, 246, 0.9); }
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: transparent;
`;

const Message = styled.div`
  max-width: 85%;
  padding: 12px 16px;
  border-radius: 18px;
  background: ${props => props.isBot
    ? 'rgba(248, 225, 231, 0.12)'
    : 'linear-gradient(135deg, rgba(232, 180, 188, 0.5) 0%, rgba(201, 160, 160, 0.4) 100%)'};
  border: ${props => props.isBot ? '1px solid rgba(232, 180, 188, 0.2)' : '1px solid rgba(232, 180, 188, 0.3)'};
  color: ${props => props.isBot ? 'rgba(253, 248, 246, 0.95)' : '#fdf8f6'};
  align-self: ${props => props.isBot ? 'flex-start' : 'flex-end'};
  line-height: 1.45;
  word-wrap: break-word;
`;

const InputContainer = styled.div`
  display: flex;
  padding: 12px 16px;
  border-top: 1px solid rgba(232, 180, 188, 0.2);
  input {
    flex: 1;
    padding: 12px 16px;
    border: 1px solid rgba(232, 180, 188, 0.3);
    border-radius: 24px;
    font-size: 14px;
    outline: none;
    background: rgba(45, 34, 36, 0.6);
    color: #fdf8f6;
    &::placeholder { color: rgba(253, 248, 246, 0.5); }
    &:focus { border-color: #e8b4bc; box-shadow: 0 0 0 2px rgba(232, 180, 188, 0.2); }
  }
  button {
    background: linear-gradient(135deg, #e8b4bc 0%, #c9a0a0 100%);
    color: #fff;
    border: none;
    border-radius: 24px;
    padding: 0 20px;
    margin-left: 8px;
    cursor: pointer;
    font-weight: 600;
    &:hover:not(:disabled) { filter: brightness(1.08); box-shadow: 0 0 20px rgba(232, 180, 188, 0.3); }
    &:disabled { opacity: 0.7; cursor: not-allowed; }
  }
`;

export default Chatbot;
