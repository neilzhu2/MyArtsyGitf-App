import { create } from 'zustand';
import { CustomDesign } from '../types/design';
import { UserOrder } from '../types/user';
import { designRepository } from '../services/repositories/DesignRepository';
import { orderRepository } from '../services/repositories/OrderRepository';

interface StudioState {
  savedDesigns: CustomDesign[];
  favoriteArtworkIds: string[];
  orders: UserOrder[];
  cartItems: { design: CustomDesign; quantity: number }[];
  isLoading: boolean;

  // Actions
  loadStudioData: () => Promise<void>;
  saveDesign: (design: CustomDesign) => Promise<void>;
  deleteDesign: (id: string) => Promise<void>;
  toggleFavoriteArtwork: (artworkId: string) => void;
  addToCart: (design: CustomDesign, quantity?: number) => void;
  removeFromCart: (designId: string) => void;
  clearCart: () => void;
  placeMockOrder: (shippingAddress: string) => Promise<UserOrder>;
}

export const useStudioStore = create<StudioState>((set, get) => ({
  savedDesigns: [],
  favoriteArtworkIds: ['art-1', 'art-2'],
  orders: [],
  cartItems: [],
  isLoading: false,

  loadStudioData: async () => {
    set({ isLoading: true });
    try {
      const designs = await designRepository.getAll();
      const orders = await orderRepository.getAll();
      set({ savedDesigns: designs, orders: orders, isLoading: false });
    } catch (e) {
      set({ isLoading: false });
    }
  },

  saveDesign: async (design: CustomDesign) => {
    const saved = await designRepository.save(design);
    const current = get().savedDesigns;
    const exists = current.some(d => d.id === saved.id);
    const updated = exists 
      ? current.map(d => (d.id === saved.id ? saved : d))
      : [saved, ...current];
    set({ savedDesigns: updated });
  },

  deleteDesign: async (id: string) => {
    await designRepository.delete(id);
    set(state => ({ savedDesigns: state.savedDesigns.filter(d => d.id !== id) }));
  },

  toggleFavoriteArtwork: (artworkId: string) => {
    set(state => {
      const exists = state.favoriteArtworkIds.includes(artworkId);
      const updated = exists 
        ? state.favoriteArtworkIds.filter(id => id !== artworkId)
        : [...state.favoriteArtworkIds, artworkId];
      return { favoriteArtworkIds: updated };
    });
  },

  addToCart: (design: CustomDesign, quantity = 1) => {
    set(state => {
      const existingIdx = state.cartItems.findIndex(i => i.design.id === design.id);
      if (existingIdx >= 0) {
        const updated = [...state.cartItems];
        updated[existingIdx].quantity += quantity;
        return { cartItems: updated };
      }
      return { cartItems: [...state.cartItems, { design, quantity }] };
    });
  },

  removeFromCart: (designId: string) => {
    set(state => ({
      cartItems: state.cartItems.filter(i => i.design.id !== designId)
    }));
  },

  clearCart: () => set({ cartItems: [] }),

  placeMockOrder: async (shippingAddress: string) => {
    const items = get().cartItems;
    if (items.length === 0) throw new Error('Cart is empty');

    const totalCad = items.reduce((acc, item) => acc + item.design.priceCad * item.quantity, 0);
    const order = await orderRepository.createOrder({
      items: items.map(i => ({ design: i.design, quantity: i.quantity, unitPriceCad: i.design.priceCad })),
      totalCad,
      shippingAddress,
    });

    set(state => ({
      orders: [order, ...state.orders],
      cartItems: [],
    }));

    return order;
  },
}));
