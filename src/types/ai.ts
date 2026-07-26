import { GiftConcept } from './gift';

export type AIRole = 'curator' | 'concierge' | 'assistant';

export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  recommendations?: GiftConcept[];
  suggestedAction?: {
    label: string;
    actionType: 'customize' | 'view-artwork' | 'view-product';
    targetId: string;
    params?: Record<string, any>;
  };
}

export interface AIGiftQuery {
  recipient?: string;
  occasion?: string;
  interest?: string;
  budgetMaxCad?: number;
  palette?: string;
  extraContext?: string;
}

export interface AIContext {
  role?: AIRole | string;
  entityTitle?: string;
  entityType?: 'artwork' | 'product' | 'occasion' | 'general';
  entityId?: string;
  initialQuery?: string;
}
