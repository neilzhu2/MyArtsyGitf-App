import { AIMessage, AIGiftQuery } from '../../types/ai';
import { GiftConcept } from '../../types/gift';
import { MOCK_GIFT_CONCEPTS } from '../../constants/mockData';
import i18n from '../../i18n';

export class AIRecommendationService {
  async getInitialGreeting(context?: { role?: string; entityTitle?: string }): Promise<AIMessage> {
    const isZh = i18n.language.startsWith('zh');
    
    if (context?.entityTitle) {
      const greetingText = isZh
        ? `您好！我是您的 **AI 礼品顾问**。针对您正在浏览的 **“${context.entityTitle}”**，我可以为您挑选相符的礼品款式、搭配色彩基调，或推荐相似风格的艺术作品。您想探索哪些方向？`
        : `Hello! I am your **AI Art Concierge**. Looking at **"${context.entityTitle}"**, I can suggest complementary gift items, color palettes, or similar artwork styles. What would you like to explore?`;

      return {
        id: `ai-greet-${Date.now()}`,
        sender: 'assistant',
        text: greetingText,
        timestamp: new Date().toISOString(),
      };
    }

    const greetingText = isZh
      ? `您好！我是 **MyArtsyGift AI 礼品顾问**。告诉我您的送礼需求（如送礼对象、节日场合、偏好的艺术风格或预算），我将为您匹配精致的艺术礼品组合。`
      : `Hello! I am your **MyArtsyGift AI Concierge**. Tell me about your gift need (e.g. recipient, occasion, preferred style, or budget), and I will curate visual art gift concepts for you.`;

    return {
      id: `ai-greet-${Date.now()}`,
      sender: 'assistant',
      text: greetingText,
      timestamp: new Date().toISOString(),
    };
  }

  async processUserQuery(userText: string, queryParams?: AIGiftQuery): Promise<AIMessage> {
    const textLower = userText.toLowerCase();
    const isZh = i18n.language.startsWith('zh');
    
    // Match concepts based on intent keywords (English & Chinese)
    let matchedConcepts: GiftConcept[] = [];

    if (
      textLower.includes('anniversary') || textLower.includes('wife') || textLower.includes('husband') || textLower.includes('partner') ||
      textLower.includes('周年') || textLower.includes('伴侣') || textLower.includes('妻子') || textLower.includes('丈夫')
    ) {
      matchedConcepts = MOCK_GIFT_CONCEPTS.filter(c => c.occasion === 'anniversary' || c.recipient === 'partner');
    } else if (
      textLower.includes('housewarming') || textLower.includes('home') || textLower.includes('room') ||
      textLower.includes('新居') || textLower.includes('入住') || textLower.includes('搬家')
    ) {
      matchedConcepts = MOCK_GIFT_CONCEPTS.filter(c => c.occasion === 'housewarming' || c.recipient === 'art-collectors');
    } else if (
      textLower.includes('birthday') || textLower.includes('mom') || textLower.includes('mother') || textLower.includes('parent') ||
      textLower.includes('生日') || textLower.includes('妈妈') || textLower.includes('母亲')
    ) {
      matchedConcepts = MOCK_GIFT_CONCEPTS.filter(c => c.occasion === 'birthday' || c.recipient === 'parents');
    } else {
      matchedConcepts = [...MOCK_GIFT_CONCEPTS].slice(0, 3);
    }

    // Apply budget filter if query contains numeric hints (e.g. 50, 100)
    let maxBudget = queryParams?.budgetMaxCad;
    if (!maxBudget) {
      if (textLower.includes('50') || textLower.includes('fifty')) maxBudget = 50;
      else if (textLower.includes('100') || textLower.includes('hundred')) maxBudget = 100;
    }

    if (maxBudget) {
      const budgetFiltered = matchedConcepts.filter(c => c.estimatedPriceCad <= maxBudget!);
      if (budgetFiltered.length > 0) {
        matchedConcepts = budgetFiltered;
      } else {
        matchedConcepts = MOCK_GIFT_CONCEPTS.filter(c => c.estimatedPriceCad <= maxBudget!);
      }
    }

    const count = matchedConcepts.length;
    let responseText = '';

    if (isZh) {
      responseText = count > 0 
        ? `我为您精心匹配了 ${count} 款艺术礼品方案。您可以直接在推荐卡片上点击 **“定制礼品”**，一键在 2D 工作室中打开并调整：`
        : `以下是为您精选的艺术送礼灵感方案：`;
    } else {
      responseText = count > 0 
        ? `I curated ${count} visual gift concept${count > 1 ? 's' : ''} based on your request. Tap **Customize** on any recommendation card to open it directly in the Customization Studio:`
        : `Here are our top curated art gift recommendations:`;
    }

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
