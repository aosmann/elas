import { Message } from './types';

const MOCK_RESPONSES = [
  "I'd be happy to help with that! Could you provide more context so I can give you the most accurate answer?",
  "That's a great question. Based on what you've shared, here's what I think: the key consideration here is to break the problem into smaller parts and tackle each one systematically.",
  "Absolutely! Here's a concise breakdown:\n\n1. **First**, identify your core requirements\n2. **Second**, research available options\n3. **Third**, implement and iterate based on feedback\n\nLet me know if you'd like to dive deeper into any of these steps.",
  "I can see what you're working toward. The most efficient approach would be to start with a minimal viable solution, then optimize as you gather more data. Does that align with your goals?",
  "Great point! This is a common challenge. The solution typically involves balancing trade-offs between performance, maintainability, and developer experience. What matters most to you?",
  "Sure thing! Here's a quick example to illustrate:\n\n```javascript\nconst result = data.map(item => ({\n  ...item,\n  processed: true\n}));\n```\n\nThis approach is clean and easy to read. Want me to expand on this?",
  "I understand. Let me think through this carefully — the underlying issue seems to be a mismatch between expectations and implementation. Aligning those two should resolve the problem.",
];

export function getMockResponse(userMessage: string): Promise<string> {
  return new Promise((resolve) => {
    const delay = 800 + Math.random() * 1200;
    setTimeout(() => {
      const index = Math.floor(Math.random() * MOCK_RESPONSES.length);
      resolve(MOCK_RESPONSES[index]);
    }, delay);
  });
}

export function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function generateChatTitle(firstMessage: string): string {
  const words = firstMessage.trim().split(/\s+/).slice(0, 5);
  const title = words.join(' ');
  return title.length < firstMessage.trim().length ? title + '...' : title;
}

export function createMessage(role: 'user' | 'assistant', content: string): Message {
  return { id: generateId(), role, content, timestamp: new Date() };
}
