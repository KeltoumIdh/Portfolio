import React from 'react';
import styled from 'styled-components';

/**
 * Production-only: disabled chat button. No API calls, no VITE_API_URL.
 * Tooltip: "Chatbot temporarily disabled"
 */
const DisabledButton = styled.button`
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 1px solid rgba(232, 180, 188, 0.35);
  background: rgba(28, 22, 24, 0.75);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  color: rgba(232, 180, 188, 0.6);
  cursor: not-allowed;
  box-shadow: 0 4px 24px rgba(0,0,0,0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 2px;
  z-index: 1000;
  opacity: 0.85;
  .label { font-size: 10px; font-weight: 600; letter-spacing: 0.04em; color: rgba(253, 248, 246, 0.6); }
  .chat-fab-icon { display: flex; align-items: center; justify-content: center; }
  .chat-fab-icon svg { flex-shrink: 0; stroke: rgba(232, 180, 188, 0.6); }
`;

export default function ChatbotDisabled() {
  return (
    <DisabledButton
      type="button"
      disabled
      aria-label="Chatbot temporarily disabled"
      title="Chatbot temporarily disabled"
    >
      <span className="chat-fab-icon" aria-hidden>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      </span>
      <span className="label">Ask AI</span>
    </DisabledButton>
  );
}
