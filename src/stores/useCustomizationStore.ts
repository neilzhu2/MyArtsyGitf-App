import { create } from 'zustand';
import { Product, ProductColor } from '../types/product';
import { Artwork } from '../types/artwork';
import { CanvasTransform, CustomDesign, DesignSourceType } from '../types/design';
import { MOCK_PRODUCTS, MOCK_ARTWORKS } from '../constants/mockData';

interface CustomizationState {
  // Current active draft settings
  activeDraftId?: string;
  sourceType: DesignSourceType;
  selectedArtwork?: Artwork;
  uploadedImageUrl?: string;
  selectedProduct: Product;
  selectedColor: ProductColor;
  transform: CanvasTransform;
  customText: string;
  textColor: string;
  isEditMode: boolean;

  // Actions
  initCustomization: (params: {
    sourceType: DesignSourceType;
    artwork?: Artwork;
    uploadedImageUrl?: string;
    product?: Product;
    color?: ProductColor;
    customText?: string;
  }) => void;
  setProduct: (product: Product) => void;
  setColor: (color: ProductColor) => void;
  setArtwork: (artwork: Artwork) => void;
  setUploadedImage: (url: string) => void;
  updateTransform: (partial: Partial<CanvasTransform>) => void;
  resetTransform: () => void;
  setCustomText: (text: string) => void;
  setTextColor: (color: string) => void;
  setEditMode: (isEdit: boolean) => void;
  exportAsDesign: () => CustomDesign;
}

const DEFAULT_TRANSFORM: CanvasTransform = {
  positionX: 0,
  positionY: 0,
  scale: 1.0,
  rotationDeg: 0,
  mirrorX: false,
};

export const useCustomizationStore = create<CustomizationState>((set, get) => ({
  sourceType: 'artwork',
  selectedArtwork: MOCK_ARTWORKS[0],
  uploadedImageUrl: undefined,
  selectedProduct: MOCK_PRODUCTS[0],
  selectedColor: MOCK_PRODUCTS[0].availableColors[0],
  transform: { ...DEFAULT_TRANSFORM },
  customText: '',
  textColor: '#141414',
  isEditMode: true,

  initCustomization: ({ sourceType, artwork, uploadedImageUrl, product, color, customText }) => {
    const prod = product || MOCK_PRODUCTS[0];
    const col = color || prod.availableColors[0];
    const art = artwork || (sourceType === 'artwork' ? MOCK_ARTWORKS[0] : undefined);

    set({
      activeDraftId: `draft-${Date.now()}`,
      sourceType,
      selectedArtwork: art,
      uploadedImageUrl: uploadedImageUrl,
      selectedProduct: prod,
      selectedColor: col,
      transform: { ...DEFAULT_TRANSFORM },
      customText: customText || '',
      textColor: '#141414',
      isEditMode: true,
    });
  },

  setProduct: (product) => {
    const currentColor = get().selectedColor;
    const matchingColor = product.availableColors.find(c => c.name === currentColor.name) || product.availableColors[0];
    set({ selectedProduct: product, selectedColor: matchingColor });
  },

  setColor: (color) => set({ selectedColor: color }),
  setArtwork: (artwork) => set({ sourceType: 'artwork', selectedArtwork: artwork, uploadedImageUrl: undefined }),
  setUploadedImage: (url) => set({ sourceType: 'upload', uploadedImageUrl: url, selectedArtwork: undefined }),

  updateTransform: (partial) => set(state => ({
    transform: { ...state.transform, ...partial }
  })),

  resetTransform: () => set({ transform: { ...DEFAULT_TRANSFORM } }),
  setCustomText: (text) => set({ customText: text }),
  setTextColor: (color) => set({ textColor: color }),
  setEditMode: (isEdit) => set({ isEditMode: isEdit }),

  exportAsDesign: () => {
    const state = get();
    const artworkTitle = state.selectedArtwork?.title || 'Personal Photo';
    const previewImage = state.sourceType === 'artwork' 
      ? (state.selectedArtwork?.imageUrl || state.selectedProduct.mockupImageUrl)
      : (state.uploadedImageUrl || state.selectedProduct.mockupImageUrl);

    return {
      id: state.activeDraftId || `design-${Date.now()}`,
      title: `${artworkTitle} on ${state.selectedProduct.title}`,
      sourceType: state.sourceType,
      artworkId: state.selectedArtwork?.id,
      artworkTitle: state.selectedArtwork?.title,
      artistName: state.selectedArtwork?.artistName,
      uploadedImageUrl: state.uploadedImageUrl,
      productId: state.selectedProduct.id,
      productTitle: state.selectedProduct.title,
      selectedColor: state.selectedColor,
      transform: { ...state.transform },
      customText: state.customText,
      textColor: state.textColor,
      previewUrl: previewImage,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      priceCad: state.selectedProduct.basePriceCad,
    };
  },
}));
