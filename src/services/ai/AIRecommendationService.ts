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
      const text = isZh
        ? `您好！针对艺术作品 **“${artTitle}”**，我可以为您挑选最匹配的实体礼品载体（如陶瓷马克杯、丝绸围巾或艺术挂画），并定制赠言。请问想了解哪些选项？`
        : `Hello! Looking at artwork **"${artTitle}"**, I can suggest complementary gift items and inscriptions. How would you like to explore?`;

      return {
        id: `ai-greet-${Date.now()}`,
        sender: 'assistant',
        text,
        timestamp: new Date().toISOString(),
      };
    }

    // 2. Triggered from Product Detail Page
    if (context?.entityType === 'product') {
      const prodTitle = context.entityTitle || 'Product';
      const text = isZh
        ? `您好！针对礼品 **“${prodTitle}”**，我可以为您推荐最搭配的正版艺术图样与礼卡铭文。请问是为您自己还是哪位朋友挑选？`
        : `Hello! For physical gift **"${prodTitle}"**, I can match licensed artworks and custom gift card inscriptions. Who are you shopping for?`;

      return {
        id: `ai-greet-${Date.now()}`,
        sender: 'assistant',
        text,
        timestamp: new Date().toISOString(),
      };
    }

    // 3. Polite, Warm Gifting Concierge Greeting (No pushy card dump)
    const greetingText = isZh
      ? `您好，欢迎来到 MyArtsyGift 灵感工坊。我是您的 AI 艺术送礼顾问。\n\n今天想为哪位特别的朋友或场合挑选礼物？您可以使用下方预设的选项组合，也可以直接告诉我您的心意。`
      : `Welcome to MyArtsyGift. I am your AI Art & Gift Concierge.\n\nWho are you choosing a gift for today? You can select from the preset options below or type your gift thoughts directly.`;

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
      textLower.includes('生日') || textLower.includes('妈妈') || textLower.includes('母亲') || textLower.includes('长辈')
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
        ? `针对您的心意，我为您精选了 ${count} 款专属礼品方案。您可以点击卡片上的 **“定制礼品”** 在 2D 工作室中预览与调整：`
        : `以下是为您精选的艺术送礼方案：`;
    } else {
      responseText = count > 0 
        ? `I curated ${count} visual gift concept${count > 1 ? 's' : ''} for your request. Tap **Customize** on any recommendation card to preview in the Customization Studio:`
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
