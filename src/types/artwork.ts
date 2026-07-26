export interface Artist {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  coverUrl: string;
  bio: string;
  story: string;
  location: string;
  socialLinks: {
    instagram?: string;
    website?: string;
  };
  featuredArtworkIds: string[];
  totalArtworks: number;
}

export interface Artwork {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  artistAvatar: string;
  imageUrl: string;
  description: string;
  medium: string;
  year: string;
  style: string;
  subject: string;
  colorPalette: string[];
  dimensions: string;
  tags: string[];
  supportedProductIds: string[];
  isFeatured?: boolean;
  likesCount: number;
  storySnippet?: string;
}
