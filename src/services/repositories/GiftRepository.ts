import { GiftOccasion, GiftConcept, OccasionType } from '../../types/gift';
import { MOCK_OCCASIONS, MOCK_GIFT_CONCEPTS } from '../../constants/mockData';

export interface IGiftRepository {
  getOccasions(): Promise<GiftOccasion[]>;
  getConcepts(): Promise<GiftConcept[]>;
  getConceptsByOccasion(slug: OccasionType): Promise<GiftConcept[]>;
  getConceptById(id: string): Promise<GiftConcept | undefined>;
}

export class MockGiftRepository implements IGiftRepository {
  private occasions: GiftOccasion[] = [...MOCK_OCCASIONS];
  private concepts: GiftConcept[] = [...MOCK_GIFT_CONCEPTS];

  async getOccasions(): Promise<GiftOccasion[]> {
    return this.occasions;
  }

  async getConcepts(): Promise<GiftConcept[]> {
    return this.concepts;
  }

  async getConceptsByOccasion(slug: OccasionType): Promise<GiftConcept[]> {
    return this.concepts.filter(c => c.occasion === slug);
  }

  async getConceptById(id: string): Promise<GiftConcept | undefined> {
    return this.concepts.find(c => c.id === id);
  }
}

export const giftRepository = new MockGiftRepository();
