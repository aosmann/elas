import React, { useEffect, useRef, useState } from 'react';
import { Clock, User, HelpCircle, Zap, FileText, Code2, Globe } from 'lucide-react';
import { Chat, Message, Model } from '../types';
import ChatMessage from './ChatMessage';
import MessageInput from './MessageInput';
import ModelSelector from './ModelSelector';
import { getMockResponse, createMessage } from '../utils';

interface ChatAreaProps {
  chat: Chat | null;
  model: Model;
  onModelChange: (m: Model) => void;
  onUpdateChat: (chatId: string, messages: Message[], title?: string) => void;
  onNewChat: (firstMessage: string) => string;
}

const SUGGESTIONS = [
  { icon: <Zap size={16} />, text: 'Explain quantum computing simply' },
  { icon: <Code2 size={16} />, text: 'Write a React component for me' },
  { icon: <FileText size={16} />, text: 'Summarize a document' },
  { icon: <Globe size={16} />, text: 'Translate text to Spanish' },
];

export default function ChatArea({ chat, model, onModelChange, onUpdateChat, onNewChat }: ChatAreaProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [isTemporary, setIsTemporary] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat?.messages, streamingText]);

  const handleSend = async (text: string) => {
    if (isLoading) return;

    let activeChatId = chat?.id ?? null;
    let existingMessages: Message[] = chat?.messages ?? [];

    const userMsg = createMessage('user', text);
    const updatedMessages = [...existingMessages, userMsg];

    if (!activeChatId) {
      activeChatId = onNewChat(text);
      onUpdateChat(activeChatId, updatedMessages);
    } else {
      onUpdateChat(activeChatId, updatedMessages);
    }

    setIsLoading(true);
    abortRef.current = false;

    try {
      const response = await getMockResponse(text);
      if (abortRef.current) return;

      // Simulate streaming
      let streamed = '';
      setStreamingText('');
      for (let i = 0; i < response.length; i++) {
        if (abortRef.current) break;
        streamed += response[i];
        setStreamingText(streamed);
        await new Promise((r) => setTimeout(r, 12));
      }

      if (!abortRef.current) {
        const aiMsg = createMessage('assistant', response);
        onUpdateChat(activeChatId, [...updatedMessages, aiMsg]);
      }
    } finally {
      setStreamingText('');
      setIsLoading(false);
    }
  };

  const handleStop = () => {
    abortRef.current = true;
    setIsLoading(false);
    setStreamingText('');
  };

  const messages = chat?.messages ?? [];
  const isEmpty = messages.length === 0;

  return (
    <main className={`chat-area ${messages.length > 0 ? 'has-messages' : ''}`}>
      {/* Header */}
      <header className="chat-header">
        <ModelSelector model={model} onChange={onModelChange} />
        <div className="header-right">
          <button
            className={`temporary-btn ${isTemporary ? 'temporary-btn--on' : ''}`}
            onClick={() => setIsTemporary((t) => !t)}
            title="Temporary chat — not saved to history"
          >
            <Clock size={14} />
            <span>Temporary</span>
          </button>
          <button className="avatar-btn" title="Account">
            <User size={16} />
          </button>
        </div>
      </header>

      {/* Messages or Empty State */}
      <div className={`chat-scroll ${messages.length > 0 ? 'with-messages' : ''}`}>
        {isEmpty ? (
          <div className="empty-state">
            <div className="empty-logo">
              <img
                src="https://images.squarespace-cdn.com/content/v1/697bc10e1897a6304e62d6e3/c338fb32-d437-463e-b46d-23423dfd6a92/logo-h-%404000x.png?format=1500w"
                alt="ElastixAI"
                className="empty-logo-img"
              />
            </div>
            <h1 className="empty-heading">Chat anything</h1>
            <div className="suggestions">
              {SUGGESTIONS.map((s, i) => (
                <button key={i} className="suggestion-btn" onClick={() => handleSend(s.text)}>
                  <span className="suggestion-icon">{s.icon}</span>
                  <span>{s.text}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isLoading && streamingText && (
              <ChatMessage
                message={createMessage('assistant', streamingText)}
              />
            )}
            {isLoading && !streamingText && (
              <div className="msg-row msg-row--assistant">
                <div className="msg-avatar msg-avatar--ai">
                  <span className="typing-dot" />
                </div>
                <div className="msg-bubble msg-bubble--assistant">
                  <div className="typing-indicator">
                    <span /><span /><span />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="chat-input-area">
        <MessageInput onSend={handleSend} isLoading={isLoading} onStop={handleStop} />
      </div>

      {/* Help button */}
      <button className="help-btn" title="Help">
        <HelpCircle size={18} />
      </button>
    </main>
  );
}
