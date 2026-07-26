import { ProductColor } from './product';

export type DesignSourceType = 'artwork' | 'upload' | 'ai-concept';

export interface CanvasTransform {
  positionX: number; // Offset percentage (-50 to 50)
  positionY: number; // Offset percentage (-50 to 50)
  scale: number;     // 0.5 to 2.5
  rotationDeg: number; // 0 to 360
  mirrorX?: boolean;
}

export interface CustomDesign {
  id: string;
  title: string;
  sourceType: DesignSourceType;
  artworkId?: string;
  artworkTitle?: string;
  artistName?: string;
  uploadedImageUrl?: string;
  productId: string;
  productTitle: string;
  selectedColor: ProductColor;
  transform: CanvasTransform;
  customText?: string;
  textColor?: string;
  previewUrl: string;
  createdAt: string;
  updatedAt: string;
  priceCad: number;
}
