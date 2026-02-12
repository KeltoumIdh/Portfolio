import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';

const Chatbot = ({ isOpen, onClose, onOpen }) => {
  const [messages, setMessages] = useState([
    { text: "Hi! Ask me about Keltoum's projects, skills, or experience.", isBot: true, ts: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    setError(null);
    const userMessage = { text: trimmed, isBot: false, ts: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/chat`, { message: trimmed });
      setMessages(prev => [...prev, { text: response.data.reply, isBot: true, ts: Date.now() }]);
    } catch (err) {
      setError(err?.response?.data?.detail || err?.message || 'Connection failed.');
      setMessages(prev => [...prev, {
        text: "Something went wrong. Please check your connection and try again.",
        isBot: true,
        isError: true,
        ts: Date.now()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (ts) => {
    if (!ts) return '';
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) {
    return (
      <OpenButton onClick={onOpen} aria-label="Open chat">
        <span className="chat-fab-icon" aria-hidden>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
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
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a4 4 0 0 0-4 4v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4z"/></svg>
          </span>
          <div>
            <h3>Portfolio Assistant</h3>
            <p>Ask about projects & experience</p>
          </div>
        </div>
        <CloseButton onClick={onClose} aria-label="Close chat">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </CloseButton>
      </ChatHeader>

      <MessagesContainer>
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} isBot={msg.isBot} isError={msg.isError}>
            <span className="bubble-text">{msg.text}</span>
            <span className="bubble-time">{formatTime(msg.ts)}</span>
          </MessageBubble>
        ))}
        {loading && (
          <MessageBubble isBot>
            <TypingIndicator>
              <span>AI is thinking...</span>
              <span className="dots"><span/><span/><span/></span>
            </TypingIndicator>
          </MessageBubble>
        )}
        <div ref={messagesEndRef} />
      </MessagesContainer>

      {error && (
        <ErrorBar>
          <span>{error}</span>
          <button type="button" onClick={() => setError(null)}>Dismiss</button>
        </ErrorBar>
      )}

      <InputContainer>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about projects, skills..."
          disabled={loading}
          aria-label="Message"
        />
        <SendButton onClick={sendMessage} disabled={loading || !input.trim()} type="button">
          {loading ? '…' : 'Send'}
        </SendButton>
      </InputContainer>
    </ChatContainer>
  );
};

const pulse = keyframes`
  0%, 100% { opacity: 1; box-shadow: 0 4px 24px rgba(0,0,0,0.25), 0 0 32px rgba(232, 180, 188, 0.2); }
  50%      { opacity: 0.95; box-shadow: 0 4px 28px rgba(0,0,0,0.28), 0 0 48px rgba(232, 180, 188, 0.35); }
`;

const dotBounce = keyframes`
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-4px); }
`;

const openModal = keyframes`
  from { opacity: 0; transform: translateY(16px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

const OpenButton = styled.button`
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 1px solid rgba(232, 180, 188, 0.45);
  background: rgba(28, 22, 24, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  color: #e8b4bc;
  cursor: pointer;
  box-shadow: 0 4px 24px rgba(0,0,0,0.3), 0 0 40px rgba(232, 180, 188, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 2px;
  z-index: 1000;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  animation: ${pulse} 2.5s ease-in-out infinite;

  .label { font-size: 10px; font-weight: 600; letter-spacing: 0.04em; color: rgba(253, 248, 246, 0.9); }
  .chat-fab-icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .chat-fab-icon svg { flex-shrink: 0; stroke: #e8b4bc; }

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 8px 32px rgba(0,0,0,0.35), 0 0 56px rgba(232, 180, 188, 0.28);
    border-color: rgba(232, 180, 188, 0.65);
    animation: none;
  }
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px rgba(232, 180, 188, 0.5);
  }
`;

const CloseButton = styled.button`
  background: rgba(232, 180, 188, 0.12);
  border: 1px solid rgba(232, 180, 188, 0.25);
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
    background: rgba(232, 180, 188, 0.25);
    border-color: rgba(232, 180, 188, 0.45);
  }
  &:focus-visible { outline: none; box-shadow: 0 0 0 2px rgba(232, 180, 188, 0.4); }
`;

const ChatContainer = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 400px;
  max-width: calc(100vw - 32px);
  height: 560px;
  max-height: calc(100vh - 120px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 24px 64px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04), 0 0 80px rgba(232, 180, 188, 0.06);
  display: flex;
  flex-direction: column;
  background: rgba(28, 22, 24, 0.72);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  font-family: 'Segoe UI', system-ui, sans-serif;
  z-index: 1000;
  overflow: hidden;
  animation: ${openModal} 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
`;

const ChatHeader = styled.div`
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.04);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  color: #fdf8f6;
  padding: 16px 20px;
  border-radius: 24px 24px 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .chat-header-content { display: flex; align-items: center; gap: 12px; }
  .chat-header-icon {
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    color: #e8b4bc;
  }
  .chat-header-icon svg { display: block; stroke: #e8b4bc; }
  h3 { margin: 0 0 2px 0; font-size: 1.05rem; font-weight: 600; color: #fdf8f6; }
  p { margin: 0; font-size: 12px; color: rgba(253, 248, 246, 0.7); }
`;

const MessagesContainer = styled.div`
  flex: 1;
  min-height: 0;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: transparent;
  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: rgba(232, 180, 188, 0.2); border-radius: 3px; }
`;

const MessageBubble = styled.div`
  max-width: 88%;
  padding: 12px 16px;
  border-radius: 18px;
  align-self: ${props => props.isBot ? 'flex-start' : 'flex-end'};
  display: flex;
  flex-direction: column;
  gap: 6px;

  background: ${props => props.isBot
    ? (props.isError
      ? 'linear-gradient(135deg, rgba(180, 100, 100, 0.2) 0%, rgba(140, 80, 80, 0.15) 100%)'
      : 'linear-gradient(160deg, rgba(248, 225, 231, 0.18) 0%, rgba(232, 180, 188, 0.08) 100%)')
    : 'linear-gradient(135deg, rgba(45, 35, 38, 0.95) 0%, rgba(35, 28, 30, 0.98) 100%)'};

  border: 1px solid ${props => props.isBot
    ? (props.isError ? 'rgba(180, 100, 100, 0.35)' : 'rgba(232, 180, 188, 0.2)')
    : 'rgba(255, 255, 255, 0.08)'};

  color: ${props => props.isBot ? 'rgba(253, 248, 246, 0.95)' : '#fdf8f6'};
  line-height: 1.5;
  word-wrap: break-word;

  .bubble-text { white-space: pre-wrap; }
  .bubble-time {
    font-size: 10px;
    opacity: 0.55;
    align-self: flex-end;
  }
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: rgba(253, 248, 246, 0.8);

  .dots {
    display: inline-flex;
    gap: 4px;
    align-items: center;
  }
  .dots span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #e8b4bc;
    animation: ${dotBounce} 0.6s ease-in-out infinite;
  }
  .dots span:nth-child(2) { animation-delay: 0.1s; }
  .dots span:nth-child(3) { animation-delay: 0.2s; }
`;

const ErrorBar = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 16px;
  background: rgba(160, 80, 80, 0.2);
  border-top: 1px solid rgba(180, 100, 100, 0.3);
  color: rgba(253, 248, 246, 0.9);
  font-size: 12px;
  button {
    flex-shrink: 0;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.2);
    color: inherit;
    padding: 4px 10px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 11px;
  }
  button:hover { background: rgba(255,255,255,0.1); }
`;

const InputContainer = styled.div`
  flex-shrink: 0;
  display: flex;
  padding: 14px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  gap: 10px;
  background: rgba(0, 0, 0, 0.15);

  input {
    flex: 1;
    padding: 12px 18px;
    border: 1px solid rgba(232, 180, 188, 0.25);
    border-radius: 24px;
    font-size: 14px;
    outline: none;
    background: rgba(45, 34, 36, 0.6);
    color: #fdf8f6;
    transition: border-color 0.2s, box-shadow 0.2s;
    &::placeholder { color: rgba(253, 248, 246, 0.45); }
    &:focus {
      border-color: rgba(232, 180, 188, 0.5);
      box-shadow: 0 0 0 2px rgba(232, 180, 188, 0.15);
    }
    &:disabled { opacity: 0.7; cursor: not-allowed; }
  }
`;

const SendButton = styled.button`
  background: linear-gradient(135deg, #e8b4bc 0%, #c9a0a0 100%);
  color: #fff;
  border: none;
  border-radius: 24px;
  padding: 0 20px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: filter 0.2s, box-shadow 0.2s, opacity 0.2s;
  &:hover:not(:disabled) {
    filter: brightness(1.08);
    box-shadow: 0 4px 20px rgba(232, 180, 188, 0.35);
  }
  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px rgba(232, 180, 188, 0.5);
  }
`;

export default Chatbot;
