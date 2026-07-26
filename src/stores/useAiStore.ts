import { create } from 'zustand';
import { AIMessage } from '../types/ai';
import { aiRecommendationService } from '../services/ai/AIRecommendationService';

interface AiState {
  isOpen: boolean;
  activeContext?: { role?: string; entityTitle?: string; entityId?: string };
  messages: AIMessage[];
  isThinking: boolean;

  // Actions
  openAiAssistant: (context?: { role?: string; entityTitle?: string; entityId?: string }) => Promise<void>;
  closeAiAssistant: () => void;
  sendMessage: (text: string) => Promise<void>;
  resetConversation: () => void;
}

export const useAiStore = create<AiState>((set, get) => ({
  isOpen: false,
  messages: [],
  isThinking: false,

  openAiAssistant: async (context) => {
    set({ isOpen: true, activeContext: context });
    if (get().messages.length === 0) {
      set({ isThinking: true });
      const initialMsg = await aiRecommendationService.getInitialGreeting(context);
      set({ messages: [initialMsg], isThinking: false });
    }
  },

  closeAiAssistant: () => set({ isOpen: false }),

  sendMessage: async (text: string) => {
    if (!text.trim()) return;

    const userMsg: AIMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };

    set(state => ({ messages: [...state.messages, userMsg], isThinking: true }));

    // Simulate AI Concierge processing
    setTimeout(async () => {
      const responseMsg = await aiRecommendationService.processUserQuery(userText);
      set(state => ({
        messages: [...state.messages, responseMsg],
        isThinking: false,
      }));
    }, 600);
    const userText = text.trim();
  },

  resetConversation: () => set({ messages: [], activeContext: undefined }),
}));
