import React from 'react';
import {
  Plus,
  Search,
  MessageSquare,
  Trash2,
  ChevronRight,
} from 'lucide-react';
import { Chat } from '../types';

interface SidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export default function Sidebar({
  chats,
  activeChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  searchQuery,
  onSearchChange,
}: SidebarProps) {
  const filtered = chats.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <img
          src="https://images.squarespace-cdn.com/content/v1/697bc10e1897a6304e62d6e3/c338fb32-d437-463e-b46d-23423dfd6a92/logo-h-%404000x.png?format=1500w"
          alt="ElastixAI"
          className="sidebar-logo-img"
        />
      </div>

      {/* New Chat */}
      <button className="new-chat-btn" onClick={onNewChat}>
        <Plus size={16} />
        <span>New chat</span>
      </button>

      {/* Search */}
      <div className="search-wrapper">
        <Search size={14} className="search-icon" />
        <input
          className="search-input"
          placeholder="Search chats"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Chat List */}
      <div className="chat-list">
        {filtered.length > 0 && (
          <p className="chat-list-label">Chats</p>
        )}
        {filtered.map((chat) => (
          <div
            key={chat.id}
            className={`chat-item ${activeChatId === chat.id ? 'chat-item--active' : ''}`}
            onClick={() => onSelectChat(chat.id)}
          >
            <MessageSquare size={14} className="chat-item-icon" />
            <span className="chat-item-title">{chat.title}</span>
            <button
              className="chat-item-delete"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteChat(chat.id);
              }}
              title="Delete chat"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
        {searchQuery && filtered.length === 0 && (
          <p className="chat-list-empty">No chats found</p>
        )}
      </div>

      {/* Bottom branding */}
      <div className="sidebar-footer">
        <img
          src="https://images.squarespace-cdn.com/content/v1/697bc10e1897a6304e62d6e3/c338fb32-d437-463e-b46d-23423dfd6a92/logo-h-%404000x.png?format=1500w"
          alt="ElastixAI"
          className="footer-logo-img"
        />
      </div>
    </aside>
  );
}
