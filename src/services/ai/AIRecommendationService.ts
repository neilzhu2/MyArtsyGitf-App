import { AIMessage, AIGiftQuery, AIContext } from '../../types/ai';
import { GiftConcept } from '../../types/gift';
import { MOCK_GIFT_CONCEPTS } from '../../constants/mockData';
import i18n from '../../i18n';

export class AIRecommendationService {
  async getInitialGreeting(context?: AIContext): Promise<AIMessage> {
    const isZh = i18n.language.startsWith('zh');
    
    // 1. Triggered from Artwork Detail Page
    if (context?.entityType === 'artwork' || (context?.entityTitle && context?.role === 'curator')) {
      const artTitle = context.entityTitle || 'Artwork';
      const matched = MOCK_GIFT_CONCEPTS.slice(0, 2);

      const text = isZh
        ? `您好！我是您的 **AI 灵感顾问**。针对艺术作品 **“${artTitle}”**，我已为您智能生成了 2 款最匹配的实体礼品概念：`
        : `Hello! Looking at artwork **"${artTitle}"**, I generated 2 curated physical gift concepts for you:`;

      return {
        id: `ai-greet-${Date.now()}`,
        sender: 'assistant',
        text,
        timestamp: new Date().toISOString(),
        recommendations: matched,
      };
    }

    // 2. Triggered from Product Detail Page
    if (context?.entityType === 'product') {
      const prodTitle = context.entityTitle || 'Product';
      const matched = MOCK_GIFT_CONCEPTS.slice(1, 3);

      const text = isZh
        ? `您好！针对礼品载体 **“${prodTitle}”**，我已为您匹配了最动人的正版艺术图样与专属铭文：`
        : `Hello! For physical gift **"${prodTitle}"**, I matched recommended licensed artworks and gift card inscriptions:`;

      return {
        id: `ai-greet-${Date.now()}`,
        sender: 'assistant',
        text,
        timestamp: new Date().toISOString(),
        recommendations: matched,
      };
    }

    // 3. General AI Concierge Trigger (from Gifts tab "用 AI 寻觅礼品灵感" or FAB "灵感顾问")
    const matched = MOCK_GIFT_CONCEPTS.slice(0, 3);
    const greetingText = isZh
      ? `您好！我是 **MyArtsyGift AI 礼品顾问**。请告诉我您的送礼需求（如送礼对象、节日场合、偏好风格或预算），或从下方热门灵感中选择：`
      : `Hello! I am your **MyArtsyGift AI Concierge**. Tell me about your gift need (recipient, occasion, style, or budget), or select from popular gift queries below:`;

    return {
      id: `ai-greet-${Date.now()}`,
      sender: 'assistant',
      text: greetingText,
      timestamp: new Date().toISOString(),
      recommendations: matched,
    };
  }

  async processUserQuery(userText: string, queryParams?: AIGiftQuery): Promise<AIMessage> {
    const textLower = userText.toLowerCase();
    const isZh = i18n.language.startsWith('zh');
    
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
        ? `我为您精心匹配了 ${count} 款艺术礼品方案。您可以直接在卡片上点击 **“定制礼品”** 一键进入 2D 工作室调整：`
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
