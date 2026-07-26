import { AIMessage, AIGiftQuery } from '../../types/ai';
import { GiftConcept } from '../../types/gift';
import { MOCK_GIFT_CONCEPTS, MOCK_ARTWORKS, MOCK_PRODUCTS } from '../../constants/mockData';

export class AIRecommendationService {
  async getInitialGreeting(context?: { role?: string; entityTitle?: string }): Promise<AIMessage> {
    if (context?.entityTitle) {
      return {
        id: `ai-greet-${Date.now()}`,
        sender: 'assistant',
        text: `Welcome! I am your AI Curator. Looking at **"${context.entityTitle}"**, I can suggest physical gift items, complementary color palettes, or similar artwork styles. What would you like to explore?`,
        timestamp: new Date().toISOString(),
      };
    }

    return {
      id: `ai-greet-${Date.now()}`,
      sender: 'assistant',
      text: `Hello! I am your **MyArtsyGift AI Concierge**. Tell me about your gift need (e.g., recipient, occasion, preferred style, or budget), and I will curate visual art gift concepts for you.`,
      timestamp: new Date().toISOString(),
    };
  }

  async processUserQuery(userText: string, queryParams?: AIGiftQuery): Promise<AIMessage> {
    const textLower = userText.toLowerCase();
    
    // Match concepts based on intent
    let matchedConcepts: GiftConcept[] = [];

    if (textLower.includes('anniversary') || textLower.includes('wife') || textLower.includes('husband') || textLower.includes('partner')) {
      matchedConcepts = MOCK_GIFT_CONCEPTS.filter(c => c.occasion === 'anniversary' || c.recipient === 'partner');
    } else if (textLower.includes('housewarming') || textLower.includes('home') || textLower.includes('room')) {
      matchedConcepts = MOCK_GIFT_CONCEPTS.filter(c => c.occasion === 'housewarming' || c.recipient === 'art-collectors');
    } else if (textLower.includes('birthday') || textLower.includes('mom') || textLower.includes('mother') || textLower.includes('parent')) {
      matchedConcepts = MOCK_GIFT_CONCEPTS.filter(c => c.occasion === 'birthday' || c.recipient === 'parents');
    } else {
      matchedConcepts = [...MOCK_GIFT_CONCEPTS].slice(0, 3);
    }

    // Apply budget filter if query contains numeric hints (e.g. 50, 100)
    let maxBudget = queryParams?.budgetMaxCad;
    if (!maxBudget) {
      if (textLower.includes('under 50') || textLower.includes('50 cad') || textLower.includes('50$')) maxBudget = 50;
      else if (textLower.includes('under 100') || textLower.includes('100 cad') || textLower.includes('100$')) maxBudget = 100;
    }

    if (maxBudget) {
      matchedConcepts = matchedConcepts.filter(c => c.estimatedPriceCad <= maxBudget!);
      if (matchedConcepts.length === 0) {
        matchedConcepts = MOCK_GIFT_CONCEPTS.filter(c => c.estimatedPriceCad <= maxBudget!);
      }
    }

    // Dynamic response text based on findings
    const count = matchedConcepts.length;
    const responseText = count > 0 
      ? `I curated ${count} visual gift concept${count > 1 ? 's' : ''} based on your request. You can tap **Customize** on any recommendation to open it directly in the Customization Studio:`
      : `Here are our top curated art gift recommendations:`;

    return {
      id: `ai-msg-${Date.now()}`,
      sender: 'assistant',
      text: responseText,
      timestamp: new Date().toISOString(),
      recommendations: matchedConcepts,
    };
  }
}

export const aiRecommendationService = new AIRecommendationService();
