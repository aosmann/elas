import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Paperclip, ArrowUp, StopCircle, Mic } from 'lucide-react';

interface MessageInputProps {
  onSend: (text: string) => void;
  isLoading: boolean;
  onStop: () => void;
  disabled?: boolean;
}

export default function MessageInput({ onSend, isLoading, onStop, disabled }: MessageInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [value]);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setValue('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="input-wrapper">
      <div className="input-box">
        <textarea
          ref={textareaRef}
          className="input-textarea"
          placeholder="Ask anything"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={disabled}
        />
        <div className="input-toolbar">
          <div className="input-toolbar-left">
            <button className="toolbar-btn" title="Attach file">
              <Paperclip size={15} />
              <span>Attach</span>
            </button>
            <button className="toolbar-btn" title="Voice input">
              <Mic size={15} />
            </button>
          </div>
          <div className="input-toolbar-right">
            {isLoading ? (
              <button className="send-btn send-btn--stop" onClick={onStop} title="Stop">
                <StopCircle size={16} />
              </button>
            ) : (
              <button
                className={`send-btn ${value.trim() ? 'send-btn--active' : 'send-btn--inactive'}`}
                onClick={handleSend}
                disabled={!value.trim()}
                title="Send"
              >
                <ArrowUp size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
      <p className="input-hint">ElastixAI can make mistakes. Verify important information.</p>
    </div>
  );
}
