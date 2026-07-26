export type OccasionType = 
  | 'anniversary' 
  | 'birthday' 
  | 'wedding' 
  | 'housewarming' 
  | 'valentines' 
  | 'thank-you' 
  | 'holidays' 
  | 'just-because';

export type RecipientType = 
  | 'partner' 
  | 'parents' 
  | 'friends' 
  | 'pet-lovers' 
  | 'art-collectors' 
  | 'colleagues';

export interface GiftOccasion {
  id: string;
  slug: OccasionType;
  title: string;
  subtitle: string;
  coverImageUrl: string;
  recommendedTag: string;
}

export interface GiftConcept {
  id: string;
  title: string;
  tagline: string;
  occasion: OccasionType;
  recipient: RecipientType;
  artworkId: string;
  productId: string;
  mockupPreviewUrl: string;
  suggestedText?: string;
  estimatedPriceCad: number;
  reason: string;
}
