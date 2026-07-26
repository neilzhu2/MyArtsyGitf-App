export type ProductCategory = 'wall-art' | 'drinkware' | 'apparel' | 'accessories' | 'home-decor' | 'stationery';

export interface ProductColor {
  name: string;
  hex: string;
  previewOverlayHex?: string;
}

export interface Product {
  id: string;
  title: string;
  category: ProductCategory;
  subcategory: string;
  mockupImageUrl: string;
  basePriceCad: number;
  availableColors: ProductColor[];
  description: string;
  dimensions: string;
  material: string;
  isCustomizable: boolean;
  supportedOperations: ('move' | 'scale' | 'rotate' | 'text' | 'color')[];
  aspectRatio: number; // e.g. 1.0 for square, 1.4 for portrait canvas, etc.
  printAreaRatio: { x: number; y: number; width: number; height: number }; // Relative percentage bounds 0..1
}
