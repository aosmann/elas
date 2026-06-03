import React from 'react';
import { Message } from '../types';
import { User, Sparkles, Copy, ThumbsUp, ThumbsDown } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

function formatContent(content: string) {
  // Very simple markdown: code blocks and bold
  const parts = content.split(/(```[\s\S]*?```)/g);
  return parts.map((part, i) => {
    if (part.startsWith('```') && part.endsWith('```')) {
      const code = part.slice(3, -3).replace(/^\w+\n/, '');
      return (
        <pre key={i} className="msg-code">
          <code>{code}</code>
        </pre>
      );
    }
    // Bold
    const bold = part.split(/(\*\*[^*]+\*\*)/g).map((b, j) => {
      if (b.startsWith('**') && b.endsWith('**')) {
        return <strong key={j}>{b.slice(2, -2)}</strong>;
      }
      // Numbered list lines
      if (b.includes('\n')) {
        return b.split('\n').map((line, k) => (
          <React.Fragment key={k}>
            {line}
            {k < b.split('\n').length - 1 && <br />}
          </React.Fragment>
        ));
      }
      return b;
    });
    return <React.Fragment key={i}>{bold}</React.Fragment>;
  });
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
  };

  return (
    <div className={`msg-row ${isUser ? 'msg-row--user' : 'msg-row--assistant'}`}>
      {!isUser && (
        <div className="msg-avatar msg-avatar--ai">
          <Sparkles size={14} />
        </div>
      )}
      <div className={`msg-bubble ${isUser ? 'msg-bubble--user' : 'msg-bubble--assistant'}`}>
        <div className="msg-content">{formatContent(message.content)}</div>
        {!isUser && (
          <div className="msg-actions">
            <button className="msg-action-btn" onClick={copyToClipboard} title="Copy">
              <Copy size={13} />
            </button>
            <button className="msg-action-btn" title="Good response">
              <ThumbsUp size={13} />
            </button>
            <button className="msg-action-btn" title="Bad response">
              <ThumbsDown size={13} />
            </button>
          </div>
        )}
      </div>
      {isUser && (
        <div className="msg-avatar msg-avatar--user">
          <User size={14} />
        </div>
      )}
    </div>
  );
}
