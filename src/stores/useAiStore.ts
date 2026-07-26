import { create } from 'zustand';
import { AIMessage, AIContext } from '../types/ai';
import { aiRecommendationService } from '../services/ai/AIRecommendationService';

interface AiState {
  isOpen: boolean;
  activeContext?: AIContext;
  messages: AIMessage[];
  isThinking: boolean;

  // Actions
  openAiAssistant: (context?: AIContext) => Promise<void>;
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
    
    // Always load fresh contextual greeting if messages empty or context provided
    if (get().messages.length === 0 || context?.entityTitle) {
      set({ isThinking: true });
      const initialMsg = await aiRecommendationService.getInitialGreeting(context);
      set({ messages: [initialMsg], isThinking: false });
    }
  },

  closeAiAssistant: () => set({ isOpen: false }),

  sendMessage: async (text: string) => {
    const userText = text.trim();
    if (!userText) return;

    const userMsg: AIMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userText,
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
  },

  resetConversation: () => set({ messages: [], activeContext: undefined }),
}));
