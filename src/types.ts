export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

export type Model = 'ElastixAI' | 'ElastixAI Pro' | 'ElastixAI Mini';
