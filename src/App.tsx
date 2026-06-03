import { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import { Chat, Message, Model } from './types';
import { generateId, generateChatTitle } from './utils';

const INITIAL_CHATS: Chat[] = [
  {
    id: 'c1',
    title: 'Typo Assistance Request',
    messages: [],
    createdAt: new Date(),
  },
  {
    id: 'c2',
    title: 'Quadratic Function Plot',
    messages: [],
    createdAt: new Date(),
  },
  {
    id: 'c3',
    title: 'Toyota Names Poetry',
    messages: [],
    createdAt: new Date(),
  },
  {
    id: 'c4',
    title: 'Urban Green Spaces',
    messages: [],
    createdAt: new Date(),
  },
];

export default function App() {
  const [chats, setChats] = useState<Chat[]>(INITIAL_CHATS);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [model, setModel] = useState<Model>('ElastixAI');
  const [searchQuery, setSearchQuery] = useState('');

  const activeChat = chats.find((c) => c.id === activeChatId) ?? null;

  const handleNewChat = useCallback(() => {
    setActiveChatId(null);
  }, []);

  const handleCreateChat = useCallback((firstMessage: string): string => {
    const id = generateId();
    const newChat: Chat = {
      id,
      title: generateChatTitle(firstMessage),
      messages: [],
      createdAt: new Date(),
    };
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(id);
    return id;
  }, []);

  const handleUpdateChat = useCallback((chatId: string, messages: Message[], title?: string) => {
    setChats((prev) =>
      prev.map((c) =>
        c.id === chatId
          ? { ...c, messages, ...(title ? { title } : {}) }
          : c
      )
    );
    setActiveChatId(chatId);
  }, []);

  const handleDeleteChat = useCallback((id: string) => {
    setChats((prev) => prev.filter((c) => c.id !== id));
    if (activeChatId === id) setActiveChatId(null);
  }, [activeChatId]);

  return (
    <div className="app-layout">
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onNewChat={handleNewChat}
        onSelectChat={setActiveChatId}
        onDeleteChat={handleDeleteChat}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <ChatArea
        chat={activeChat}
        model={model}
        onModelChange={setModel}
        onUpdateChat={handleUpdateChat}
        onNewChat={handleCreateChat}
      />
    </div>
  );
}
