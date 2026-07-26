import { Artwork } from '../../types/artwork';
import { MOCK_ARTWORKS } from '../../constants/mockData';

export interface IArtworkRepository {
  getAll(): Promise<Artwork[]>;
  getById(id: string): Promise<Artwork | undefined>;
  getByArtistId(artistId: string): Promise<Artwork[]>;
  getFeatured(): Promise<Artwork[]>;
  search(query: string): Promise<Artwork[]>;
  getByTag(tag: string): Promise<Artwork[]>;
}

export class MockArtworkRepository implements IArtworkRepository {
  private artworks: Artwork[] = [...MOCK_ARTWORKS];

  async getAll(): Promise<Artwork[]> {
    return this.artworks;
  }

  async getById(id: string): Promise<Artwork | undefined> {
    return this.artworks.find(art => art.id === id);
  }

  async getByArtistId(artistId: string): Promise<Artwork[]> {
    return this.artworks.filter(art => art.artistId === artistId);
  }

  async getFeatured(): Promise<Artwork[]> {
    return this.artworks.filter(art => art.isFeatured);
  }

  async search(query: string): Promise<Artwork[]> {
    const q = query.toLowerCase().trim();
    if (!q) return this.artworks;
    return this.artworks.filter(
      art =>
        art.title.toLowerCase().includes(q) ||
        art.description.toLowerCase().includes(q) ||
        art.artistName.toLowerCase().includes(q) ||
        art.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  async getByTag(tag: string): Promise<Artwork[]> {
    const t = tag.toLowerCase();
    return this.artworks.filter(art => art.tags.some(tagItem => tagItem.toLowerCase() === t));
  }
}

export const artworkRepository = new MockArtworkRepository();
