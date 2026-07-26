import { Artist } from '../../types/artwork';
import { MOCK_ARTISTS } from '../../constants/mockData';

export interface IArtistRepository {
  getAll(): Promise<Artist[]>;
  getById(id: string): Promise<Artist | undefined>;
  getFeatured(): Promise<Artist[]>;
}

export class MockArtistRepository implements IArtistRepository {
  private artists: Artist[] = [...MOCK_ARTISTS];

  async getAll(): Promise<Artist[]> {
    return this.artists;
  }

  async getById(id: string): Promise<Artist | undefined> {
    return this.artists.find(artist => artist.id === id);
  }

  async getFeatured(): Promise<Artist[]> {
    return this.artists.slice(0, 3);
  }
}

export const artistRepository = new MockArtistRepository();
